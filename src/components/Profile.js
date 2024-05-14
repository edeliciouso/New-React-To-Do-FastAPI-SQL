import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import ProfilePicture from './ProfilePicture';
import { doSignOut } from '../firebase/auth';

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         // Redirect the user to the login page after logging out
    //         navigate.push('/login');
    //         console.log('Logout Successful!')
    //     } catch (error) {
    //         console.error('Error logging out:', error.message);
    //     }
    // };

    return (
        <div className="container mx-auto mt-10">
            {currentUser && (
                <div className="profile-card"> {/* Updated className */}
                    <h2 className="text-2xl font-semibold mb-4">Profile Page</h2>
                    <ProfilePicture /> {/* Render the ProfilePicture component */}
                    <div className="profile-info">
                        <p>Email: {currentUser.email}</p>
                        {/* You can display additional user information here */}
                    </div>
                    <div className="profile-links">
                        <Link to="/app" className="text-blue-500 hover:underline">Back to Homepage</Link>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className="logout-btn">Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
