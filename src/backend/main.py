from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
import models
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database tables are created
models.Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ToDo(BaseModel):
    id: str
    title: str 
    completed: bool = False

class ToDoCreate(BaseModel):
    title: str 
    completed: bool = False

class ToDoUpdate(BaseModel):
    title: Optional[str]
    completed: Optional[bool]

# Get All Tasks
@app.get("/tasks/", response_model=list[ToDo])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(models.ToDo).all()

# Add a Task
@app.post("/tasks/", response_model=ToDo)
def create_task(todo: ToDoCreate, db: Session = Depends(get_db)):
    try:
        db_todo = models.ToDo(**todo.model_dump(), id=str(uuid4()))
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

# Delete Task 
@app.delete("/tasks/{task_id}/")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    try:
        # Retrieve the task from the database
        db_todo = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Delete the task
        db.delete(db_todo)
        db.commit()
        
        return {"message": "Task deleted successfully"}
    except Exception as e:
        print(f"Error deleting task: {e}")  # Print the error message to the console
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete task")

# Update a Task
@app.put("/tasks/{task_id}", response_model=ToDo)
def update_task(task_id: str, todo_update: ToDoUpdate, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if db_todo is None:
            raise HTTPException(status_code=404, detail="Task not found")
        if todo_update.title is not None:
            db_todo.title = todo_update.title
        if todo_update.completed is not None:
            db_todo.completed = todo_update.completed
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

# Toggle Complete
@app.put("/tasks/{task_id}/toggle")
def toggle_task_complete(task_id: str, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(models.ToDo).filter(models.ToDo.id == task_id).first()
        if db_todo is None:
            raise HTTPException(status_code=404, detail="Task not found")
        db_todo.completed = not db_todo.completed
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")