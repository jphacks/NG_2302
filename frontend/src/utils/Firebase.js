import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
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

export const registerClientAccount = async (client_id, user_id) => {
    const docRef = doc(db, "updates", client_id);
    const docSnap = await getDoc(docRef);
    console.log("Document data:", docSnap.data());
    if (docSnap.exists()) {
        // すでにSpotifyIDが存在する場合
        const users = docSnap.data().users;
        if (users === undefined) {
            // usersが存在しない場合 -> 追加する
            await updateDoc(docRef, {
                count: 0,
                users: [user_id],
            });
        } else if (users.includes(user_id)) {
            // すでにUserIdが存在する場合 -> 何もしない
            console.log("すでに登録済みです");
        } else {
            // まだUserIdが存在しない場合 -> 追加する
            await updateDoc(docRef, {
                count: 0,
                users: [...users, user_id],
            });
        }
    } else {
        // SpotifyIdが存在しない場合 -> 追加する
        await setDoc(docRef, {
            count: 0,
            users: [user_id],
        });
    }
}

export const registerUserAccount = async (user_id) => {
    const querySnapshot = await getDocs(query(collection(db, "updates")));
    querySnapshot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        const users = doc.data().users;
        if (users !== undefined && users.includes(user_id)) {
            return doc.id;
        } else {
            return null;
        }
    });
}

export const updatedQueue = async (client_id) => {
    const docRef = doc(db, "updates", client_id);
    const docSnap = await getDoc(docRef);
    // 更新通知で他のデバイスと同期させるために、
    // カウントをインクリメントする
    await updateDoc(docRef, {
        count: docSnap.data().count + 1,
    });
}

export const setOnSnapshot = (client_id, accessToken, setMusicInfo) => {
    if (unsubscribe != null) return;
    token = accessToken;
    const docRef = doc(db, "updates", client_id);
    unsubscribe = onSnapshot(docRef, async (doc) => {
        // 初回は実行しない
        if (!isFirst && token !== '') {
            console.log("\nCurrent data: ", doc.data());
            const info = await getQueueInfo(token);
            if (window.location.pathname === '/home')  {
                setMusicInfo(info);
            }
        } else {
            isFirst = false;
            console.log('setOnSnapshot');
        }
    });
}