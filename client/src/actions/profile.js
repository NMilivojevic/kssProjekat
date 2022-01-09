import axios from "axios";
import { setAlert } from "./alert";

import {
    ACCOUNT_DELETED,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    GET_REPOS
} from "./types";

// get current users profile 
export const getCurrentProfile = () => async (dispatch) => {
    // we wanna hit /profile/me
    try {
        const res = await axios.get("/profile/me"); // knows which profile to load we dont need the id because it knows because of the token we are sending as well
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// get all profiles
export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const res = await axios.get("/profile"); // knows which profile to load we dont need the id because it knows because of the token we are sending as well
        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


// get profile by id
export const getProfileById = userId => async (dispatch) => {
    try {
        const res = await axios.get(`/profile/user/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// get github repos
export const getGithubRepos = (username) => async (dispatch) => {
    try {
        const res = await axios.get(`/profile/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Create or update a profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.post("/profile", formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });


        dispatch(setAlert(edit ? "Profile Updated." : "Profile Created.", "success"));

        if (!edit) {
            history.push("/dashboard");
        }

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// add projects
export const addProjects = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.put("/profile/projects", formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Projects Added.", "success"));
        history.push("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// remove projects
export const deleteProjects = id => async dispatch => {
    try {
        const res = await axios.delete(`/profile/projects/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert("Project Removed", "success"));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// delete account and profile
export const deleteAccount = () => async dispatch => {
    // we wanna confirm za svaki slucaj
    if (window.confirm("Jeste li sigurni da zelite da izbrisete nalog?")) {
        try {
            await axios.delete("/profile");
            dispatch({
                type: CLEAR_PROFILE,
            })
            dispatch({
                type: ACCOUNT_DELETED,
            })
            dispatch(setAlert("Izbrisali ste profil"));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}

