import React, { Fragment, useEffect } from 'react'
import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileTop from "./ProfileTop"
import ProfileAbout from "./ProfileAbout";
import ProfileProjects from "./ProfileProjects";
import ProfileGithub from "./ProfileGithub"

const Profile = ({ getProfileById, profile: { profile, loading }, match }) => {
    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match.params.id])
    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> :
                <Fragment>
                    <Link to="/profiles" className='btn btn-light mt-3'>Nazad</Link>
                    <div className='profile-grid my-1'>
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />
                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Rađeni projekti</h2>
                            {profile.projects.length > 0 ? (<Fragment>
                                {profile.projects.map(project => (
                                    <ProfileProjects key={project._id} project={project} />
                                ))}
                            </Fragment>
                            ) : (
                                <h4>Nije rađen projekat</h4>
                            )}
                        </div>
                        {profile.githubusername && (
                            <ProfileGithub username={profile.githubusername} />
                        )}
                    </div>
                </Fragment>}
        </Fragment >
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    // auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    // auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile);
