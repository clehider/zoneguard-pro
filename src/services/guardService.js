import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'guards';

class GuardService {
  async addGuard(guardData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...guardData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error al agregar guardia:", error);
      throw error;
    }
  }

  async getGuards() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener guardias:", error);
      throw error;
    }
  }
}

export const guardService = new GuardService();