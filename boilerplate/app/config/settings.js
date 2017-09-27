/**
 * Created by Andy Wooller on 25/09/2017.
 * Settings file for any constants
 * The settings file can retrieve values from external environment config files
 * Any valuable data or data than changes per environment should be stored in external config files.
 */
import envConfig from 'react-native-config'

//Get exampleURI from env config file.
export const settings = {
    uri: envConfig.exampleURI
};

export default settings;

