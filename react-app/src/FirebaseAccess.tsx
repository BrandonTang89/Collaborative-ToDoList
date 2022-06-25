import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// --- Firebase Set-up ---
// Import the functions you need from the SDKs you need
import {
    getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    sendPasswordResetEmail, signOut
} from "firebase/auth";
import { collection, getFirestore, getDocs, setDoc, doc, addDoc, deleteDoc, query, where } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDrlde3EB2ZnRNP5WdCmxZaQFSfBXw-19Q",
    authDomain: "collaborative-todolist.firebaseapp.com",
    databaseURL: "https://collaborative-todolist-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "collaborative-todolist",
    storageBucket: "collaborative-todolist.appspot.com",
    messagingSenderId: "888107193418",
    appId: "1:888107193418:web:d39afb933dc797c1b082b3",
    measurementId: "G-PG3HP7VS4P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


// === Firebase Auth ===
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err);
    }
};
const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err);
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        console.error(err);
        alert(err);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};

// === Firebase Firestore ===
// -- Userlists CRUD --
interface listinforep {id:string, name:string, desc:string, users: Array<string>, owner: string};
export const getUserlists = async (user) => {
    console.log(user.uid);
    const querySnapshot = await getDocs(query(collection(db, "tasklists"), where("users", "array-contains", user.email)));
    let accesiblelists: Array<{ id: string, name: string, desc:string, users:Array<string>, owner:string }> = [];
    querySnapshot.forEach(doc => {
        accesiblelists.push({
            id: doc.id,
            name: doc.data().name,
            desc: doc.data().desc,
            users: doc.data().users,
            owner: doc.data().owner

        });
    });

    return accesiblelists;
}


export const UpdateList = async (listinfo:listinforep) => {
    const tasksColRef = collection(db, "tasklists/");
    const docRef = doc(tasksColRef, listinfo.id);

    if (!(listinfo.users.includes(listinfo.owner))) {
        listinfo.users.push(listinfo.owner);
    }
    console.log(listinfo);
    try {
        await setDoc(docRef, {
            name: listinfo.name,
            desc: listinfo.desc,
            users: listinfo.users,
            owner: listinfo.owner,
        });
        return true;
    }
    catch (error) {
        console.log("error updating list");
        console.log(error);
        return false;
    }
}

export const AddList = async (listinfo:listinforep) => {
    const tasksColRef = collection(db, "tasklists/");

    if (!(listinfo.users.includes(listinfo.owner))) {
        listinfo.users.push(listinfo.owner);
    }
    try {
        await addDoc(tasksColRef, {
            name: listinfo.name,
            desc: listinfo.desc,
            users: listinfo.users,
            owner: listinfo.owner,
        });
        return true;
    }
    catch (error) {
        console.log("error adding list");
        console.log(error);
        return false;
    }
}


export const DeleteList = async (listinfo:listinforep) => {
    const tasksColRef = collection(db, "tasklists/");
    const docRef = doc(tasksColRef, listinfo.id);
    try {
        await deleteDoc(docRef);
        return true;
    }
    catch (error) {
        console.log("error deleting list");
        console.log(error);
        return false;
    }
}

// -- Task List CRUD --
interface taskRowRep { _id: string, name: string, desc: string, tags: Array<string>, taskStatus: string }
// returns list
export const getListData = async (listname: string) => {
    const tasksColRef = collection(db, "tasklists/" + listname + "/tasks");
    const querySnapshot = await getDocs(tasksColRef);
    let tasks: Array<taskRowRep> = [];
    querySnapshot.forEach(doc => {
        // console.log(doc.id, " => ", doc.data());
        tasks.push({
            _id: doc.id,
            name: doc.data().name,
            desc: doc.data().desc,
            tags: doc.data().tags,
            taskStatus: doc.data().taskstatus
        });
    });
    return tasks;
}


export const UpdateTask = async (listname: string, task: taskRowRep) => {
    const tasksColRef = collection(db, "tasklists/" + listname + "/tasks");
    const docRef = doc(tasksColRef, task._id);
    try {
        await setDoc(docRef, {
            name: task.name,
            desc: task.desc,
            tags: task.tags,
            taskstatus: task.taskStatus
        });
        return true;
    }
    catch (error) {
        console.log("error updating task");
        console.log(error);
        return false;
    }
}

export const AddTask = async (listname: string, task: taskRowRep) => {
    const tasksColRef = collection(db, "tasklists/" + listname + "/tasks");
    try {
        await addDoc(tasksColRef, {
            name: task.name,
            desc: task.desc,
            tags: task.tags,
            taskstatus: task.taskStatus
        });
        return true;
    }
    catch (error) {
        console.log("error adding task");
        console.log(error);
        return false;
    }
}

export const DeleteTask = async (listname: string, task: taskRowRep) => {
    const tasksColRef = collection(db, "tasklists/" + listname + "/tasks");
    const docRef = doc(tasksColRef, task._id);
    try {
        await deleteDoc(docRef);
        return true;
    }
    catch (error) {
        console.log("error deleting task");
        console.log(error);
        return false;
    }
}