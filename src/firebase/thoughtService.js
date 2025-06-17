import {addDoc, collection, deleteDoc, getDocs, query, doc} from 'firebase/firestore';
import {db} from './config';

// Collection name
const THOUGHT_COLLECTION = 'thought';

export const addThought = async (thought, emotion) => {
    try{
        const docRef = await addDoc(collection(db,THOUGHT_COLLECTION),{
            thought: thought,
            emotion: emotion
            });
        return docRef.id;
    }catch(error){
        console.log(error);
    }
}

//Get every single thought
export const getThoughts = async () => {
    try {
        const q = query(collection(db,THOUGHT_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch(error) {
        console.error(error);
    }
}

export const deleteThought = async (thoughtId) => {
    try{
        await deleteDoc(doc(db, THOUGHT_COLLECTION, thoughtId));
    }
    catch(error){
        console.log(error);
    }
}