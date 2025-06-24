import {
    collection,
    addDoc,
    query,
    orderBy,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// Collection name
const MIND_COLLECTION = 'mind';

export const addTask = async (task) => {
    try {
        const docRef = await addDoc(collection(db, MIND_COLLECTION), {
            name: task.name,
            description: task.description,
            due_date: task.due_date,
            is_complete: task.is_complete ?? false
        });
        return docRef.id;
    } catch (error) {
        console.log(error);
    }
}

export const completeTask = async (taskId) => {
    try {
        const taskRef = doc(db, MIND_COLLECTION, taskId);
        await updateDoc(taskRef, {
            is_complete: true,
            completed_date: new Date().toISOString()
        });
        return taskRef.id;
    } catch (error) {
        console.error('Error completing task:', error);
        throw error;
    }
}


export const getCompletedTasks = async () => {
    try{

        const now = new Date();

        const q = query(collection(db,MIND_COLLECTION),
            where("is_complete", "==", true),
            // where(Date("due_date"), ">=", now.getTime()),
            orderBy("due_date")
        );

        const querySnapshot = await getDocs(q);
        const completedTasks = [];
        querySnapshot.forEach((doc) => {
            completedTasks.push({ id: doc.id, ...doc.data() });
        });
        
        return completedTasks;

    }catch(error){
        console.log(error);
    }
}

export const getIncompleteTasks = async() => {
    try{
        const q = query(collection(db, MIND_COLLECTION),
        orderBy("due_date"),
        where("is_complete", "==", false)
        );
  
        const querySnapshot = await getDocs(q);
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        return tasks; 
  
    } catch(error){
      console.log({error});
    }
}

export const deleteIncompleteTask = async (taskId) => {
    try{
        await deleteDoc(doc(db, MIND_COLLECTION, taskId));
    } catch(error){
        console.log(error);
    }
}

export const deleteCompletedTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, MIND_COLLECTION, taskId));
        return true;
    } catch (error) {
        console.error('Error deleting completed task:', error);
        throw error;
    }
}
