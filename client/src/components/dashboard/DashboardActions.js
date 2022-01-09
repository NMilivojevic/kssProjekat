import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardActions = () => {
    return (
        <div className="dash-buttons">
            <Link to="/edit-profile" className="btn btn-dark"> Pregled Profila</Link>
            <Link to="/add-projects" className="btn btn-dark"> Dodaj Projekat</Link>
        </div>
    )
}

export default DashboardActions;
