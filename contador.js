import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generar o recuperar ID único del dispositivo
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

// Verificar si ya existe
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  // Ya existe: incrementar visitas
  await updateDoc(docRef, {
    visitas: increment(1),
    ultimaVisita: serverTimestamp()
  });
} else {
  // Nuevo dispositivo
  await setDoc(docRef, {
    visitas: 1,
    ultimaVisita: serverTimestamp()
  });
}

// Mostrar visitas de este dispositivo
const updatedSnap = await getDoc(docRef);
const visitas = updatedSnap.data().visitas;
document.getElementById("contador").innerText = `Tus visitas: ${visitas}`;
