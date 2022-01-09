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
        // large text-primary mt-3
        <div className='profile bg-light'>
            <img src={avatar} alt="Profile" className='round-img p-2' />
            <div>
                <h2 className="py-1">{name}</h2>
                <p className='py-1'>{studies}{"  -  "}<span>{yearofstudy} godina</span></p>
                <p>{status}</p>
                <Link to={`/profile/${_id}`} className='btn btn-primary mt-1'>Pogledajte profil</Link>
            </div>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index} className='text-primary py-1'> 
                        <i class="fas fa-arrow-right"></i>
                        {" "}
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
