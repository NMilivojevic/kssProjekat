import React, { Fragment, useState } from 'react'
import { Link, withRouter } from "react-router-dom";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { addProjects } from '../../actions/profile';

const AddProjects = ({ addProjects, history }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        from: "",
        to: "",
        current: false
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { title, description, from, to, current } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = (e) => {
        e.preventDefault();
        addProjects(formData, history);
    };

    return (
        <Fragment>
            <h1 className="large text-primary mt-3">
                Dodaj Projekat
            </h1>
            <p className="lead">
                Opiši projekat
            </p>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Naziv" name="title" required value={title} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Čemu služi, tehnologije korišćene, programski jezici, softver..."
                        value={description} onChange={e => onChange(e)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <h4>Početak Projekta</h4>
                    <input type="date" name="from" value={from} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <p><input type="checkbox" name="current" checked={current} value="" value={current} onChange={e => { setFormData({ ...formData, current: !current }); toggleDisabled(!toDateDisabled) }} /> {" "} Trenutno radim na projektu</p>
                </div>
                <div className="form-group">
                    <h4>Kraj Projekta</h4>
                    <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisabled ? "disabled" : ""} />
                </div>
                <input type="submit" className="btn btn-primary my-1" value="Dodaj" />
                <Link className="btn btn-light my-1" to="/dashboard">Nazad</Link>
            </form>
        </Fragment>
    )
}

AddProjects.propTypes = {
    addProjects: PropTypes.func.isRequired,
}

export default connect(null, { addProjects })(withRouter(AddProjects));

