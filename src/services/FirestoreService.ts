import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export const FirestoreService = {
  // ==========================================
  // SECTION : COURS (CRUD COMPLET)
  // ==========================================

  // READ : Récupérer tous les cours
  async getCourses() {
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  // READ : Récupérer les cours par catégorie (ex: 'Anglais')
  async getCoursesByCategory(category: string) {
    try {
      const q = query(
        collection(db, 'courses'), 
        where("Categorie", "==", category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      // Fallback si l'index n'est pas encore prêt
      const q = query(collection(db, 'courses'), where("Categorie", "==", category));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  // CREATE : Ajouter un cours
  async addCourse(data: any) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        title: data.title,
        Description: data.Description,
        Categorie: data.Categorie,
        FormateurId: Number(data.FormateurId),
        Published: data.Published,
        URL_image: data.URL_image,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error: any) {
      console.error("Erreur addCourse:", error); 
      throw error;
    }
  },

  // UPDATE : Modifier un cours
  async updateCourse(courseId: string, data: any) {
    try {
      const docRef = doc(db, 'courses', courseId);
      await updateDoc(docRef, { 
        ...data, 
        updatedAt: Timestamp.now() 
      });
    } catch (error) {
      console.error("Erreur updateCourse:", error);
      throw error;
    }
  },

  // DELETE : Supprimer un cours
  async deleteCourse(courseId: string) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
    } catch (error) {
      console.error("Erreur deleteCourse:", error);
      throw error;
    }
  },

  // ==========================================
  // SECTION : MODULES (CRUD COMPLET)
  // ==========================================
  
  // READ : Récupérer les modules d'un cours
  async getModules(courseId: string) {
    try {
      const modulesRef = collection(db, 'courses', courseId, 'modules');
      const q = query(modulesRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      const modulesRef = collection(db, 'courses', courseId, 'modules');
      const querySnapshot = await getDocs(modulesRef);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  // CREATE : Ajouter un module
  async addModule(courseId: string, data: any) {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const modulesRef = collection(db, 'courses', courseId, 'modules');
      
      const docRef = await addDoc(modulesRef, {
        title: data.title,
        Description: data.Description,
        Niveau: data.Niveau,
        Url_photo: data.Url_photo,
        Published: Boolean(data.Published),
        CoursID: courseRef, 
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Erreur addModule:", error);
      throw error;
    }
  },

  // UPDATE : Modifier un module
  async updateModule(courseId: string, moduleId: string, data: any) {
    try {
      const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
      await updateDoc(moduleRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur updateModule:", error);
      throw error;
    }
  },

  // DELETE : Supprimer un module
  async deleteModule(courseId: string, moduleId: string) {
    try {
      await deleteDoc(doc(db, 'courses', courseId, 'modules', moduleId));
    } catch (error) {
      console.error("Erreur deleteModule:", error);
      throw error;
    }
  }
};