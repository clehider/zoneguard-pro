import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'points';

class PointService {
  async addPoint(pointData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...pointData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar punto:', error);
      throw error;
    }
  }

  async getPoints() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener puntos:", error);
      throw error;
    }
  }
}

export const pointService = new PointService();