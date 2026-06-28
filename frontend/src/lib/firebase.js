import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCaJNz-jczxITKO2sjLX2kqJ82PdGhfnV0',
  authDomain: 'subdeals-696aa.firebaseapp.com',
  databaseURL: 'https://subdeals-696aa-default-rtdb.firebaseio.com',
  projectId: 'subdeals-696aa',
  storageBucket: 'subdeals-696aa.firebasestorage.app',
  messagingSenderId: '389983936414',
  appId: '1:389983936414:web:619bf5f61a8c8ddd1a408f',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);