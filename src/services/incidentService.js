import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION_NAME = "incidents";

export const incidentService = {
  addIncident: async (incidentData) => {
    try {
      // Validar que los datos necesarios estén presentes
      if (!incidentData.type) {
        throw new Error('El tipo de incidente es requerido');
      }

      // Si hay ubicación, asegurarse de que tenga el formato correcto
      if (incidentData.location) {
        if (!incidentData.location.lat || !incidentData.location.lng) {
          throw new Error('La ubicación debe tener latitud y longitud válidas');
        }
      }
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...incidentData,
        createdAt: new Date().toISOString(),
        status: incidentData.status || 'Pendiente'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar incidente:', error);
      throw error;
    }
  },

  async getIncidents() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener incidentes:", error);
      throw error;
    }
  }
};