import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAYSpLO7ng23wyZWGnwt4JytxVG5bIERSY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.appspot.com",
  messagingSenderId: "548516276046",
  appId: "1:548516276046:web:181284a13ab0c7097d601f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const comentariosRef = collection(db, "comentarios");

// Enviar comentario
document.getElementById("comentario-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (nombre && mensaje) {
    await addDoc(comentariosRef, {
      nombre,
      mensaje,
      timestamp: new Date()
    });
    e.target.reset();
  }
});

// Mostrar comentarios en tiempo real
const container = document.getElementById("comentarios-container");
const q = query(comentariosRef, orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
  container.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${data.nombre}</strong>: ${data.mensaje}</p>`;
    container.appendChild(div);
  });
});
