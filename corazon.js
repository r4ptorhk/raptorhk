import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAYSpLO7ng23wyZWGnwt4JytxVG5bIERSY",
  authDomain: "raptorhk-6a180.firebaseapp.com",
  projectId: "raptorhk-6a180",
  storageBucket: "raptorhk-6a180.firebasestorage.app",
  messagingSenderId: "548516276046",
  appId: "1:548516276046:web:181284a13ab0c7097d601f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Espera a que el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-checkbox").forEach((checkbox, i) => {
    const imageId = `imagen_${i}`;
    const localKey = `like_${imageId}`;
    const counter = document.createElement("span");
    counter.className = "like-counter";
    checkbox.parentElement.appendChild(counter);

    // Mostrar estado guardado localmente
    if (localStorage.getItem(localKey)) {
      checkbox.checked = true;
    }

    // Escuchar cambios en tiempo real del contador
    const q = query(collection(db, "corazon"), where("imageId", "==", imageId));
    onSnapshot(q, snapshot => {
      counter.textContent = `${snapshot.size} ❤️`;
    });

    // Manejar clic en el checkbox
    checkbox.addEventListener("change", async () => {
      const snapshot = await getDocs(q);

      if (checkbox.checked) {
        await addDoc(collection(db, "corazon"), {
          imageId,
          timestamp: new Date()
        });
        localStorage.setItem(localKey, "true");
      } else {
        snapshot.forEach(doc => deleteDoc(doc.ref));
        localStorage.removeItem(localKey);
      }
    });
  });
});
