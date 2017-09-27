/**
 * Created by Andy Wooller on 25/09/2017.
 * First screen containers
 * simulates user authentication to move to the next page
 */

import React, { Component } from 'react';
import FirstScreen from './firstScreen';

class firstScreenContainer extends Component {
    static navigatorStyle = {
        navBarHidden: true,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FirstScreen navigator={ this.props.navigator }  />
        );
    }
}

export default (firstScreenContainer);
