/* eslint-disable import/no-anonymous-default-export */
// reducer is a function that takes a piece of state and an action and the action is gonna get dispatched from action file and it will make sense later

import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// we implemented this in our root index.js reducer
const initialState = [];

export default function (state = initialState, action) {
    // action takes a type and data(payload)
    // the type we need to evaluate and we do that with switch case 
    const { type, payload } = action;
    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}