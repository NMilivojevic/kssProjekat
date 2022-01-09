import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"

const ProfileItem = ({ profile: {
    user: { _id, name, avatar },
    studies,
    yearofstudy,
    status,
    skills
} }) => {
    return (
        <div className='profile bg-light'>
            <img src={avatar} alt="Profile" className='round-img' />
            <div>
                <h2>{name}</h2>
                <p>{studies}{"  -  "}<span>{yearofstudy} godina</span></p>
                <p>{status}</p>
                <Link to={`/profile/${_id}`} className='btn btn-primary'>Pogledajte profil</Link>
            </div>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index} className='text-primary'> 
                        {skill}
                    </li>
                ))}
            </ul>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileItem
