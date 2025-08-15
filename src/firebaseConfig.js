// 1. Importe as funções necessárias do Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importe getStorage

// 2. SUAS PRÓPRIAS CONFIGURAÇÕES DO FIREBASE
// Copie isso do seu Firebase Console:
// Configurações do Projeto (ícone de engrenagem) -> Seus Aplicativos (Web)
const firebaseConfig = {
  apiKey: "AIzaSyCqVLZqLpFss7O2IstT1D3STp5Cm67S6zg",
  authDomain: "logbeauty-eba98.firebaseapp.com",
  projectId: "logbeauty-eba98",
  storageBucket: "logbeauty-eba98.firebasestorage.app",
  messagingSenderId: "171527656106",
  appId: "1:171527656106:web:ad120b196489fa0df8f6d3",
  measurementId: "G-D5JM72PC7L",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
