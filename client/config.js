import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()

export const API = publicRuntimeConfig.PRODUCTION ? '/api' : 'http://localhost:8000/api';

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;

