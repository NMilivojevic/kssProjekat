import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { getProfiles } from "../../actions/profile";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    // as soon as it loads we want get profiles thats why we use this hook
    useEffect(() => {
        getProfiles();
    }, []);

    return (
        <Fragment>
            {loading ? <Spinner /> :
                <Fragment>
                    <h1 className="large text-primary mt-3">Studenti</h1>
                    <p className="lead">
                        Pregled Profila Ostalih Studenata
                    </p>
                    <div className="profiles">
                        {profiles.length > 0 ? (
                            profiles.map(profile => (
                                <ProfileItem key={profile._id} profile={profile} />
                            ))
                        ) : (
                            <h4>Nisu nadjeni profili studenata</h4>
                        )}
                    </div>
                </Fragment>}
        </Fragment>
    )
};

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);
