/**
 * Created by Andy Wooller on 25/09/2017.
 * Provide a description about what this action is for
 * where does this action get called
 */

import { GET_DATA_FAILURE, GET_DATA_SUCCESS } from './actions';
import { api } from '../config/settings';


//Sends data to reducer with this action
export const getDataSuccess = (data) => {
    return {
        type: GET_DATA_SUCCESS,
        data
    }
}

//Sends data to reducer with this action
export const getDataFailure = (data) => {
    return {
        type: GET_DATA_FAILURE,
        data
    }
}

//Our function that is initiated from the GUI
export function getData() {
    return dispatch => {
        api.get('posts/1').then((response) => {
            dispatch(getDataSuccess(response.data.issues))
        }).catch((error) => {
            let response = {};
            response.code = error.request.status;
            response.error = true;

            if (response.code === 404) {
                response.message = "Resource couldn't be found.";
            } else if (response.code === 403) {
                response.message = "Resource couldn't be accessed, forbidden.";
            } else if (response.code === 500) {
                response.message = "There was an issue with the Service, please try again later.";
            } else {
                response.message = "Theres an issue please try again later.";
            }

            dispatch(getDataFailure(response))
        });
    }
}
