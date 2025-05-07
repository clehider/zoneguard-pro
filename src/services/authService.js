import { db } from '../config/firebase';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updatePassword,
  updateEmail
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'users';

class AuthService {
  constructor() {
    this.auth = getAuth();
  }

  async createUser(userData) {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      // Crear documento en Firestore
      const userDoc = await addDoc(collection(db, COLLECTION_NAME), {
        uid: userCredential.user.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'guard',
        permissions: userData.permissions || ['rondero'],
        status: 'active',
        assignedZone: userData.assignedZone || null,
        createdAt: new Date().toISOString()
      });

      return userDoc.id;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.getUserData(result.user.uid);

      if (userData.status === 'inactive') {
        await this.logout();
        throw new Error('Usuario inactivo. Contacte al administrador.');
      }

      return {
        user: result.user,
        ...userData
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async getUserData(uid) {
    try {
      const userQuery = query(
        collection(db, COLLECTION_NAME),
        where('uid', '==', uid)
      );
      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      return snapshot.docs[0].data();
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }

  async updateUserData(userId, userData) {
    try {
      const userDoc = await this.getUserDocById(userId);
      
      if (!userDoc) {
        throw new Error('Usuario no encontrado');
      }

      const updates = {};

      // Actualizar email si ha cambiado
      if (userData.email && userData.email !== userDoc.data().email) {
        await updateEmail(this.auth.currentUser, userData.email);
        updates.email = userData.email;
      }

      // Actualizar contraseña si se proporciona una nueva
      if (userData.password) {
        await updatePassword(this.auth.currentUser, userData.password);
      }

      // Actualizar otros campos si se proporcionan
      if (userData.name) updates.name = userData.name;
      if (userData.role) updates.role = userData.role;
      if (userData.permissions) updates.permissions = userData.permissions;
      if (userData.status) updates.status = userData.status;
      if (userData.assignedZone !== undefined) updates.assignedZone = userData.assignedZone;

      updates.updatedAt = new Date().toISOString();

      await updateDoc(doc(db, COLLECTION_NAME, userId), updates);

      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  async getUserDocById(userId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        data: () => docSnap.data()
      };
    } catch (error) {
      console.error('Error al obtener documento de usuario:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();