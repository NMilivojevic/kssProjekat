import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        githubusername,
        user: { name }
    }
}) => {
    return (
        <div className="profile-about bg-light p-2">
            <Fragment>
                <h2 className="text-primary">Bio</h2>
                <p>{bio}</p>
                <div className="line"></div>
            </Fragment>
            <h2 className="text-primary">Tehnologije, Alati, Softver</h2>
            <div className="skills">
                {skills.map((skill, index) => (
                    <div key={index} className="p-1">
                        <i class="fas fa-arrow-right"></i>
                        {" "}
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    )
}

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileAbout
