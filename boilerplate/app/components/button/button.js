/**
 * Created by Andy Wooller on 25/09/2017.
 * Insert a description about what this component does
 * Include what prop types it uses and any additional infomation
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const Button = (props) => {
    const { buttonStyles, textStyles, text, onPress } = props;
    return (
        <TouchableOpacity style={[styles.button, buttonStyles]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyles]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

Button.propTypes = {
    text: React.PropTypes.string,
    onPress: React.PropTypes.func,
};

Button.defaultProps = {
    text: 'Button Text',
    onPress: () => console.log('Button Pressed'),
};

export default Button;
