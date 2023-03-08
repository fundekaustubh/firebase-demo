// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, onValue, set, update, remove } from "firebase/database";
import firebaseConfig from './firebase.config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export const createUser = ({ user }) => {
    console.log("Create user called!");
    const usersRef = ref(database, 'users');
    console.log("Created user!");
    return push(usersRef, user);
}

export const readUsers = (setUsers) => {
    const usersRef = ref(database, 'users');
    const users = [];
    onValue(usersRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            users.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
    });
    setUsers(users);
}

export const updateUser = ({ userId, user }) => {
    console.log("Updated user is: ", user)
    const userRef = ref(database, `users/${userId}`);
    return set(userRef, { ...user, id: userId });
}

export const deleteUser = ({ userId }) => {
    const userRef = ref(database, `users/${userId}`);
    return remove(userRef);
}