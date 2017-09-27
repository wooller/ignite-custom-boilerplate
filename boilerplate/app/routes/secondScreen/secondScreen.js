/**
 * Created by Andy Wooller on 25/09/2017.
 * Insert a description about what this screen does
 * where is it called from
 */

import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './styles';
import images from '../../config/images';

const SecondScreen = (props) => {
    return (
        <Image style={styles.image} source={images.exampleImage}>
            <View style={styles.container}>
                <Text>This is the second screen</Text>
            </View>
        </Image>
    );
};

SecondScreen.propTypes = {

};

export default SecondScreen;
