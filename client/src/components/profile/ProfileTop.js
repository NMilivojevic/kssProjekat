import React from 'react'
import PropTypes from 'prop-types'

const ProfileTop = ({
    profile: {
        studies,
        yearofstudy,
        status,
        bio,
        githubusername,
        social,
        user: { name, avatar }
    }
}) => {
    return (
        <div className="profile-top bg-primary p-2">
            <img
                className="round-img my-1"
                src={avatar}
            />
            <h1 className="large">{name}</h1>
            <p className="lead">{studies}{" - "}<span>{yearofstudy} godina</span></p>
            <p className='lead'>{status}</p>
            <div className="icons my-1">
                {
                    githubusername && (
                        <a href={`https://github.com/${githubusername}`} target="_blank" rel="noopener noreferrer">
                            <i className='fab fa-github fa-2x'></i>
                        </a>
                    )
                }
                {
                    social && social.instagram && (
                        <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram fa-2x"></i>
                        </a>
                    )
                }
                {
                    social && social.facebook && (
                        <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook fa-2x"></i>
                        </a>
                    )
                }
                {
                    social && social.twitter && (
                        <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter fa-2x"></i>
                        </a>
                    )
                }
                {
                    social && social.linkedin && (
                        <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin fa-2x"></i>
                        </a>
                    )
                }

            </div>
        </div>
    )
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileTop
