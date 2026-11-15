/**
 * @file Conexión con Firebase: inicializa el proyecto y exporta lo que usa el
 * adaptador de sesión. Solo los archivos de Firebase lo importan; se borra al
 * migrar a PHP (ADR 0008).
 *
 * La configuración es pública por diseño: la seguridad está en las reglas de
 * Firestore, no en ocultar estos datos.
 *
 * La versión de Firebase (13.3.0) aparece en tres lugares que deben cambiar
 * juntos: las URLs del CDN de este archivo, `firebase` en package.json (para
 * los tipos) y `paths` en jsconfig.json.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import {
  doc,
  getDoc,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD-xPIIi_23crQ6Orm6YuAVyPXjXr8BH2Q',
  authDomain: 'balam-math.firebaseapp.com',
  projectId: 'balam-math',
  storageBucket: 'balam-math.firebasestorage.app',
  messagingSenderId: '1054293458563',
  appId: '1:1054293458563:web:4f16863b5a35a8e6ff25b6',
};

const app = initializeApp(firebaseConfig);

export const autenticacion = getAuth(app);
export const baseDeDatos = getFirestore(app);
export const iniciarSesionFirebase = signInWithEmailAndPassword;
export const obtenerDocumento = getDoc;
export const documento = doc;
