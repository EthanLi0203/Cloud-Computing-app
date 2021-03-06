import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()

export const API = publicRuntimeConfig.PRODUCTION ? publicRuntimeConfig.API_PRODUCTION : 'http://localhost:8000/api';

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;
export const SMARTYSTREETKEY ="9037747506370520" ;

