import {firebase} from '../../../fitness-tracker/.firebase' 

export const environment = {
  production: true,
  firebase: {
    apiKey: firebase.apiKey,
    authDomain: firebase.authDomain,
    projectId: firebase.projectId,
    storageBucket: firebase.storageBucket,
    messagingSenderId: firebase.messagingSenderId,
    appId: firebase.appId,
  }
};
