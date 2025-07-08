import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getCountFromServer,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// 🔌 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🆔 Obtener o generar ID único del dispositivo
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

const deviceId = getDeviceId();
const docRef = doc(db, "visitas", deviceId);

// 📈 Registrar solo la primera visita del dispositivo
const docSnap = await getDoc(docRef);
if (!docSnap.exists()) {
  await setDoc(docRef, {
    visitas: 1,
    primeraVisita: serverTimestamp()
  });
}

// 👁️ Mostrar visitas de este dispositivo
const updatedSnap = await getDoc(docRef);
const visitas = updatedSnap.exists() ? updatedSnap.data().visitas : 0;
const contador = document.getElementById("contador");
if (contador) {
  contador.innerText = `Tus visitas: ${visitas}`;
}

// 🌍 Mostrar total de dispositivos únicos
const visitasCollection = collection(db, "visitas");
const snapshot = await getCountFromServer(visitasCollection);
const totalDispositivos = snapshot.data().count;

const totalDiv = document.createElement("p");
totalDiv.innerText = `Dispositivos únicos: ${totalDispositivos}`;
document.body.appendChild(totalDiv);
