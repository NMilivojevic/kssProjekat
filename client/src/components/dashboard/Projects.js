import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteProjects } from "../../actions/profile";

const Projects = ({ project, deleteProjects }) => {
    const projects = project.map((proj) => (
        <tr key={proj._id}>
            <td>{proj.title}</td>
            <td>{proj.description}</td>
            <td>
                <Moment format="YYYY/MM/DD">{proj.from}</Moment>
                -
                {
                    proj.to === null ? (
                        "Trenutno"
                    ) : (
                        <Moment format="YYYY/MM/DD">{proj.to}</Moment>
                    )
                }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteProjects(proj._id)}>Izbriši</button>
            </td>
        </tr>
    ));
    return (
        <Fragment>
            <h2 className="my-2">Projekti</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th className="naziv-width">Naziv</th>
                        <th className="opis-width">Opis</th>
                        <th>Datum</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {projects}
                </tbody>
            </table>
        </Fragment>
    );
};

Projects.propTypes = {
    project: PropTypes.array.isRequired,
    deleteProjects: PropTypes.func.isRequired
};


export default connect(null, { deleteProjects })(Projects);
