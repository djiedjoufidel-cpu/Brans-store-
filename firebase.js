const firebaseConfig = {
  apiKey: "AIzaSyAnh9sO-g52xpfLbIY2f329OoYbZnW3xM8",
  authDomain: "brans-market.firebaseapp.com",
  projectId: "brans-market",
  storageBucket: "brans-market.firebasestorage.app",
  messagingSenderId: "764644444128",
  appId: "1:764644444128:web:061059bf6582b7ddc20d85",
  measurementId: "G-FRLEDHPWS2"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();