import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  setDoc,
  getDoc,
  orderBy
} from 'firebase/firestore';

const GUARDS_COLLECTION = 'guards';

export const guardService = {
  async getGuards() {
    try {
      const guardsCollection = collection(db, GUARDS_COLLECTION);
      const q = query(guardsCollection);
      const guardsSnapshot = await getDocs(q);
      return guardsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener guardias:', error);
      throw error;
    }
  },

  async addGuard(guardData) {
    try {
      const existingGuard = await this.getGuardByEmail(guardData.email);
      if (existingGuard) {
        throw new Error('Ya existe un guardia con este email');
      }

      const { password, ...dataToStore } = guardData;
      dataToStore.hashedPassword = password;
      dataToStore.status = guardData.status;
      dataToStore.email = guardData.email.toLowerCase();
      
      const docRef = await addDoc(collection(db, GUARDS_COLLECTION), dataToStore);
      return {
        id: docRef.id,
        ...dataToStore
      };
    } catch (error) {
      console.error('Error al agregar guardia:', error);
      throw error;
    }
  },

  async updateGuard(guardId, guardData) {
    try {
      const guardRef = doc(db, GUARDS_COLLECTION, guardId);
      const currentGuard = await getDoc(guardRef);
      
      if (!currentGuard.exists()) {
        throw new Error('No se encontró el guardia a actualizar');
      }

      if (guardData.email !== currentGuard.data().email) {
        const existingGuard = await this.getGuardByEmail(guardData.email);
        if (existingGuard && existingGuard.id !== guardId) {
          throw new Error('Ya existe otro guardia con este email');
        }
      }

      // Preparar datos para actualizar
      const dataToUpdate = {
        name: guardData.name,
        email: guardData.email.toLowerCase(),
        phone: guardData.phone,
        status: guardData.status // Asegurarnos de que el estado se incluya
      };

      // Si hay una nueva contraseña, actualizarla
      if (guardData.password) {
        dataToUpdate.hashedPassword = guardData.password;
      }

      // Actualizar el documento
      await updateDoc(guardRef, dataToUpdate);
      
      // Obtener los datos actualizados
      const updatedDoc = await getDoc(guardRef);
      return {
        id: guardId,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Error al actualizar guardia:', error);
      throw error;
    }
  },

  async deleteGuard(guardId) {
    try {
      const guardRef = doc(db, GUARDS_COLLECTION, guardId);
      await deleteDoc(guardRef);
      return guardId;
    } catch (error) {
      console.error('Error al eliminar guardia:', error);
      throw error;
    }
  },

  async getGuardByEmail(email) {
    try {
      const guardsCollection = collection(db, GUARDS_COLLECTION);
      const q = query(guardsCollection, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error al buscar guardia por email:', error);
      throw error;
    }
  }
};