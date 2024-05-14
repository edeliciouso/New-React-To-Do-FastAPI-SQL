import React from 'react'
import { TodoWrapper } from './TodoWrapper'
import { Link } from 'react-router-dom';
import ProfilePictureToDo from './ProfilePictureToDo'
import Name from './Name';

function TodoPic() {
  return (
    <div>
        <Link to="/profile"> {/* Link to profile page */}
          <ProfilePictureToDo /> {/* Render the profile picture component */}
        </Link>
        <div>
            <TodoWrapper/>
            <Name />
        </div>
    </div>
  )
}

export default TodoPic