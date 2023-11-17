import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { getQueueInfo } from "./ApiService";
import { db } from "../index.tsx";

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