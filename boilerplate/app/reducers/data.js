/**
 * Created by Andy Wooller on 25/09/2017.
 * These are our actions being fed into our reducer
 * is called from our actions
 */

export const data = (state = 0, action) => {
    switch (action.type) {
        case 'GET_DATA_SUCCESS':
            return action.data;
        case 'GET_DATA_FAILURE':
            return action.data;
        default:
            return state;
    }
};
