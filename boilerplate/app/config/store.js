/**
 * Created by Andy Wooller on 25/09/2017.
 * This file is for the Redux Store
 * This is a single source of truth handling all app data, and makes it accessible to the app
 */

import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
    const middewares = [
        //add middlewares here
        thunkMiddleware,
    ];

    return createStore(rootReducer, initialState, compose(
        applyMiddleware(...middewares)
        )
    );
}
