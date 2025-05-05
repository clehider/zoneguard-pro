import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'zones';

class ZoneService {
  async addZone(zoneData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...zoneData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar zona:', error);
      throw error;
    }
  }

  async getZones() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener zonas:", error);
      throw error;
    }
  }
}

export const zoneService = new ZoneService();