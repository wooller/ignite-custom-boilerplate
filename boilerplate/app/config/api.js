/**
 * Created by Andy Wooller on 25/09/2017.
 * Api file for defining any API's with Axios
 */

import axios from 'axios';
import settings from 'settings';

export let api;

//Create instance of axios
api = axios.create({
    baseURL: settings.uri + "/exampleURI/",
});