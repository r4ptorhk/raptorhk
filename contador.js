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

// 📥 Registrar la primera visita si no existe
async function registrarVisita(deviceId) {
  const ref = doc(db, "visitas", deviceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      visitas: 1,
      primeraVisita: serverTimestamp()
    });
  }
  return ref;
}

// 👁️ Mostrar visitas del dispositivo
async function mostrarVisitas(ref) {
  const snap = await getDoc(ref);
  const visitas = snap.exists() ? snap.data().visitas : 0;
  const contador = document.getElementById("contador");
  if (contador) {
    contador.innerText = `Tus visitas: ${visitas}`;
  }
}

// 🌍 Mostrar total de dispositivos únicos
async function mostrarTotalDispositivos() {
  const visitasCollection = collection(db, "visitas");
  const snapshot = await getCountFromServer(visitasCollection);
  const total = snapshot.data().count;

  const totalDiv = document.createElement("p");
  totalDiv.innerText = `Dispositivos únicos: ${total}`;
  document.body.appendChild(totalDiv);
}

// 🚀 Ejecutar flujo principal
(async () => {
  try {
    const deviceId = getDeviceId();
    const ref = await registrarVisita(deviceId);
    await mostrarVisitas(ref);
    await mostrarTotalDispositivos();
  } catch (error) {
    console.error("Error al registrar o mostrar visitas:", error);
  }
})();
