import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { getQueueInfo } from "./ApiService";

// Cloud FireStore用初期化
const firebaseConfig = {
    apiKey: "AIzaSyCsLRoJ6iB-gKx-_x3vCHq4kLoQigtljsU",
    authDomain: "dj-hukkin-56d10.firebaseapp.com",
    projectId: "dj-hukkin-56d10",
    storageBucket: "dj-hukkin-56d10.appspot.com",
    messagingSenderId: "544721830185",
    appId: "1:544721830185:web:fd49eaa0cb778283cfb738",
    measurementId: "G-0GCDV92R7S"
}
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// グローバル変数
var unsubscribe = null;
var isFirst = true;
var token = '';

export const initialAccountDocument = async (id, accessToken) => {
    const docRef = doc(db, "updates", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // すでにアカウントが存在する場合
        console.log("Document data:", docSnap.data());
    } else {
        // アカウントが存在しない場合 -> 追加する
        await setDoc(docRef, {
            count: 0,
        });
    }
    token = accessToken;
}

export const updatedQueue = async (id) => {
    const docRef = doc(db, "updates", id);
    const docSnap = await getDoc(docRef);
    // 更新通知で他のデバイスと同期させるために、
    // カウントをインクリメントする
    await setDoc(docRef, {
        count: docSnap.data().count + 1,
    });
}

export const setOnSnapshot = (id) => {
    if (unsubscribe != null) return;
    const docRef = doc(db, "updates", id);
    unsubscribe = onSnapshot(docRef, (doc) => {
        // 初回は実行しない
        if (!isFirst) {
            console.log("Current data: ", doc.data());
            getQueueInfo(token);
        } else {
            isFirst = false;
            console.log('setOnSnapshot');
        }
    });
}