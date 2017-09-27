/**
 * Created by Andy Wooller on 25/09/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import SecondScreen from './secondScreen';

class secondScreenContainer extends Component {
    static navigatorStyle = {
        navBarHidden: true,
    };

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <SecondScreen />
        );
    }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
    return {

    }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(secondScreenContainer);
