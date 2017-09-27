/**
 * Created by Andy Wooller on 25/09/2017.
 * This is our reducer that combines our reducers into one reducer for our store
 * handles all our individual reducers and makes them available to our GUI
 */

import { combineReducers } from 'redux';
import { data } from './data';
export default combineReducers({
    data
});