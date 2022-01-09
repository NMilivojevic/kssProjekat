import React from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment";

const ProfileProjects = ({ project: { title, description, from, to, current } }) => {
    return (
        <div>
            <h3 className='text-dark'>{title}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment>
                -
                {!to ? "Sada" : <Moment format="YYYY/MM/DD">{to}</Moment>}
            </p>
            <p>Opis:</p>{description}
        </div>
    )
}

ProfileProjects.propTypes = {
    project: PropTypes.array.isRequired,
};

export default ProfileProjects
