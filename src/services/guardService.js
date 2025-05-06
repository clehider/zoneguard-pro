import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'guards';

class GuardService {
  async addGuard(guardData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...guardData,
        assignedZone: guardData.assignedZone || null,
        assignedPoints: guardData.assignedPoints || [], // Nuevo campo para puntos asignados
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

  async assignPointsToGuard(guardId, pointIds) {
    try {
      // Verificar que el guardia existe
      const guardRef = doc(db, COLLECTION_NAME, guardId);
      const guardSnap = await getDoc(guardRef);
      
      if (!guardSnap.exists()) {
        throw new Error('Guardia no encontrado');
      }

      // Actualizar puntos asignados
      await updateDoc(guardRef, {
        assignedPoints: arrayUnion(...pointIds),
        updatedAt: new Date().toISOString()
      });

      // Registrar la asignación en una subcolección
      const assignmentsRef = collection(db, `${COLLECTION_NAME}/${guardId}/pointAssignments`);
      await addDoc(assignmentsRef, {
        pointIds,
        assignedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error("Error al asignar puntos:", error);
      throw error;
    }
  }

  async deleteGuard(guardId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, guardId));
    } catch (error) {
      console.error("Error al eliminar guardia:", error);
      throw error;
    }
  }

  async updateGuard(guardId, guardData) {
    try {
      const guardRef = doc(db, COLLECTION_NAME, guardId);
      await updateDoc(guardRef, {
        ...guardData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error al actualizar guardia:", error);
      throw error;
    }
  }
}

export const guardService = new GuardService();