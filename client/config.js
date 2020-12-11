import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()

export const API = publicRuntimeConfig.PRODUCTION ? '/api' : 'http://localhost:8000/api';

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const SMARTYSTREETKEY ="9037747506370520" ;

