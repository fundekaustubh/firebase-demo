import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set, remove } from "firebase/database";
import firebaseConfig from './firebase.config.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const createProduct = ({ product }) => {
    let productsRef = undefined;
    if (product.category === 'Electronics') {
        productsRef = ref(database, 'Electronics');
    }
    else {
        productsRef = ref(database, 'Clothing');
    }
    return push(productsRef, product);
}

export const readProducts = (setProducts) => {
    let productsRef = ref(database, 'Electronics');
    const products = [];
    onValue(productsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            products.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
    });
    productsRef = ref(database, 'Clothing');
    onValue(productsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            products.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });
    });
    setProducts(products);
}

export const updateProduct = ({ productId, product }) => {
    let productRef = undefined;
    if (product.category === 'Electronics') {
        productRef = ref(database, `Electronics/${productId}`);
    }
    else {
        productRef = ref(database, `Clothing/${productId}`);
    }
    return set(productRef, { ...product, id: productId });
}

export const deleteProduct = ({ productId }) => {
    let productRef = ref(database, `Electronics/${productId}`);
    remove(productRef)
    productRef = ref(database, `Clothing/${productId}`);
    return remove(productRef);
}