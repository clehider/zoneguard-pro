import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'points';

class PointService {
  async addPoint(pointData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...pointData,
        createdAt: new Date().toISOString()
      });
      console.log('Punto guardado exitosamente:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar punto:', error);
      throw new Error('Error al guardar el punto: ' + error.message);
    }
  }

  async getPoints() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const points = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Puntos recuperados:', points.length);
      return points;
    } catch (error) {
      console.error("Error al obtener puntos:", error);
      throw new Error('Error al obtener los puntos: ' + error.message);
    }
  }

  async updatePoint(pointId, pointData) {
    try {
      const pointRef = doc(db, COLLECTION_NAME, pointId);
      await updateDoc(pointRef, pointData);
      console.log('Punto actualizado exitosamente:', pointId);
      return pointId;
    } catch (error) {
      console.error('Error al actualizar punto:', error);
      throw new Error('Error al actualizar el punto: ' + error.message);
    }
  }

  async deletePoint(pointId) {
    try {
      const pointRef = doc(db, COLLECTION_NAME, pointId);
      await deleteDoc(pointRef);
      console.log('Punto eliminado exitosamente:', pointId);
      return pointId;
    } catch (error) {
      console.error('Error al eliminar punto:', error);
      throw new Error('Error al eliminar el punto: ' + error.message);
    }
  }
}

export const pointService = new PointService();