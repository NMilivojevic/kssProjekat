/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile, deleteAccount } from "../../actions/profile";


const EditProfile = ({
    deleteAccount,
    createProfile,
    history,
    getCurrentProfile,
    profile: { profile, loading },
}) => {
    const [formData, setFormData] = useState({
        studies: "",
        yearofstudy: "",
        status: "",
        skills: "",
        bio: "",
        githubusername: "",
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
    });

    useEffect(() => {
        getCurrentProfile();
        setFormData({
            studies: loading || !profile.studies ? "" : profile.studies,
            yearofstudy: loading || !profile.yearofstudy ? "" : profile.yearofstudy,
            status: loading || !profile.status ? "" : profile.status,
            skills: loading || !profile.skills ? "" : profile.skills.join(","),
            bio: loading || !profile.bio ? "" : profile.bio,
            githubusername: loading || !profile.githubusername ? "" : profile.githubusername,
            instagram: loading || !profile.social ? "" : profile.social.instagram,
            facebook: loading || !profile.social ? "" : profile.social.facebook,
            twitter: loading || !profile.social ? "" : profile.social.twitter,
            linkedin: loading || !profile.social ? "" : profile.social.linkedin,
        });
    }, [loading, getCurrentProfile]);

    const {
        studies,
        yearofstudy,
        status,
        skills,
        bio,
        githubusername,
        instagram,
        facebook,
        twitter,
        linkedin,
    } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        createProfile(formData, history, true);
    };

    return (
        <Fragment>
            <h1 className="large text-primary mt-3">Pregled Profila</h1>
            <p className="lead">
                Možeš vršiti izmene na svom profilu
            </p>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <select name="studies" value={studies} onChange={(e) => onChange(e)}>
                        <option value="0" disabled>Unesi Smer</option>
                        <option value="Savremene Računarske Tehnologije">
                            Savremene Računarske Tehnologije
                        </option>
                        <option value="Komunikacione tehnologije">
                            Komunikacione tehnologije
                        </option>
                        <option value="Građevinsko Inženjerstvo">Građevinsko Inženjerstvo</option>
                        <option value="Drumski Saobraćaj">Drumski Saobraćaj</option>
                        <option value="Industrijsko Inženjerstvo">Industrijsko Inženjerstvo</option>
                        <option value="Zaštita Na Radu">Zaštita Na Radu</option>
                    </select>
                    <small className="form-text">Tvoj Smer <strong>(Obavezno)</strong></small>
                </div>
                <div className="form-group">
                    <select
                        name="yearofstudy"
                        value={yearofstudy}
                        onChange={(e) => onChange(e)}
                    >
                        <option value="0" disabled>Godina Studija</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <small className="form-text">Godina Studija <strong>(Obavezno)</strong></small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Oblast koja te zanima"
                        name="status"
                        value={status}
                        onChange={(e) => onChange(e)}
                    />
                    <small className="form-text">Kojom Oblašću IT-a želiš da se baviš <strong>(Obavezno)</strong></small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Navedi Tehnologije koje poznaješ i softver koji koristiš"
                        name="skills"
                        value={skills}
                        onChange={(e) => onChange(e)}
                    />
                    <small className="form-text">
                        Navedi Tehnologije koje poznaješ odvojene zarezom <strong>(Obavezno)</strong>
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Bio"
                        name="bio"
                        value={bio}
                        onChange={(e) => onChange(e)}
                    />
                    <small className="form-text">Kratko O Sebi</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Github Korisničko Ime"
                        name="githubusername"
                        value={githubusername}
                        onChange={(e) => onChange(e)}
                    />
                    <small className="form-text">
                        Navedi ukoliko imaš GitHub profil
                    </small>
                </div>
                <div className="form-group social-input">
                    <i className="fab fa-twitter fa-2x"></i>
                    <input
                        type="text"
                        placeholder="Twitter URL"
                        name="twitter"
                        value={twitter}
                        onChange={(e) => onChange(e)}
                    />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-facebook fa-2x"></i>
                    <input
                        type="text"
                        placeholder="Facebook URL"
                        name="facebook"
                        value={facebook}
                        onChange={(e) => onChange(e)}
                    />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-linkedin fa-2x"></i>
                    <input
                        type="text"
                        placeholder="Linkedin URL"
                        name="linkedin"
                        value={linkedin}
                        onChange={(e) => onChange(e)}
                    />
                </div>

                <div className="form-group social-input">
                    <i className="fab fa-instagram fa-2x"></i>
                    <input
                        type="text"
                        placeholder="Instagram URL"
                        name="instagram"
                        value={instagram}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary my-1" value="Izmeni"/>
                <Link className="btn btn-light my-1" to="/dashboard">
                    Nazad
                </Link>
                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        Izbriši moj nalog
                    </button>
                </div>
            </form>
        </Fragment>
    );
};

EditProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile, deleteAccount })(
    withRouter(EditProfile)
);
