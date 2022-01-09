import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li>
                <Link to="/profiles">Studenti</Link>
            </li>
            <li>
                <Link to="/posts">Forum</Link>
            </li>
            <li>
                <Link to="/dashboard">Tvoj Profil</Link>
            </li>
            <li>
                <Link to="/" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                    {" "}
                    <span className="hide-sm">Odjavi se</span>
                </Link>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            {/* <li>
                <Link to="/profiles">STUDENTI</Link>
            </li> */}
            <li className="p-1">
                <Link to="/register">Registruj se</Link>
            </li>
            <li className="p-1">
                <Link to="/login">Uloguj se</Link>
            </li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
                <Link to="/">
                    {/* <i className="fas fa-code"></i> DevConnector */}
                    <div className="logo"></div>
                </Link>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
