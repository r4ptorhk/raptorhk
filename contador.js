// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, updateDoc, increment, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase (reemplaza con tus datos reales)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia al documento del contador
const contadorRef = doc(db, "visitas", "contador");

// Incrementar el contador
await updateDoc(contadorRef, {
  total: increment(1)
});

// Leer y mostrar el número de visitas
const docSnap = await getDoc(contadorRef);
if (docSnap.exists()) {
  const visitas = docSnap.data().total;
  document.getElementById("contador").innerText = `Visitas: ${visitas}`;
} else {
  document.getElementById("contador").innerText = "No se encontró el contador.";
}
