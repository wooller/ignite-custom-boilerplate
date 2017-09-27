/**
 * Created by Andy Wooller on 25/09/2017.
 */
import React from 'react';
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    image: {
        width: null,
        height: null,
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        width: null,
        height: null,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginButton:{
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#000',
        borderWidth: 2,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
    },
    loginButtonText:{
        color: 'black',
    },
});
