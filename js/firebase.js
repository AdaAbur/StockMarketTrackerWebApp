const firebaseConfig = {
  apiKey: "AIzaSyCc9uiwHilDkptQ5hvCPYNcCTkWgLZ-__E",
  authDomain: "tradeon-stock-market.firebaseapp.com",
  projectId: "tradeon-stock-market",
  storageBucket: "tradeon-stock-market.firebasestorage.app",
  messagingSenderId: "1079285390558",
  appId: "1:1079285390558:web:0a622d4849085befa7364f"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();