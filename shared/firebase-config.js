// Firebase Configuration
// IMPORTANT: Replace these values with your own Firebase project credentials
// Follow SETUP_FIREBASE.md for step-by-step instructions

const firebaseConfig = {
    apiKey: "AIzaSyASdfoIqm08wTU-m6iUN4yVG9yQz1UsFDI",
    authDomain: "prisoners-dilemma-game-97e4e.firebaseapp.com",
    projectId: "prisoners-dilemma-game-97e4e",
    storageBucket: "prisoners-dilemma-game-97e4e.firebasestorage.app",
    messagingSenderId: "995580483701",
    appId: "1:995580483701:web:33d23c328edaa7751bc03c",
    databaseURL: "https://prisoners-dilemma-game-97e4e-default-rtdb.europe-west1.firebasedatabase.app"
};

// Check if Firebase config is set up
export function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

export { firebaseConfig };
