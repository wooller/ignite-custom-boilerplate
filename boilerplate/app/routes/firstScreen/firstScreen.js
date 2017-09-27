/**
 * Created by Andy Wooller on 25/09/2017.
 * Insert a description about what this screen does
 * where is it called from
 */

import React, { PureComponent } from 'react';
import { Text, View, Image, StatusBar, TextInput } from 'react-native';
import styles from './styles';
import images from '../../config/images';
import Button from '../../components/button/index'

export default class FirstScreen extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Image style={styles.image} source={images.exampleImage}>
                <View style={styles.container}>
                    <Button style={styles.loginButton} buttonStyles={ styles.loginButton } textStyles={ styles.loginButtonText } text="Login" onPress={() => this.props.navigator.push({screen: 'reactNativeTemplate.secondScreenName', title: 'second screen', backButtonHidden: true})}/>
                </View>
            </Image>
        );
    }
}
