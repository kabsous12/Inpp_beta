import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FirestoreService } from '../../services/FirestoreService';
import Sidebar from '../../constants/components/sidebar';
import { 
  BookOpen, Plus, X, Image as ImageIcon, Menu,
  Loader2, User, Tag, ChevronRight, UserCircle,
  Pencil, Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id?: string;
  Categorie: string;
  Description: string;
  FormateurId: number;
  Published: boolean;
  URL_image: string;
  title: string;
}

const AnglaisModules: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    Categorie: 'Anglais',
    Description: '',
    FormateurId: 0,
    Published: true,
    URL_image: '',
    title: ''
  };

  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await FirestoreService.getCoursesByCategory('Anglais');
      setCourses(data as Course[] || []);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE CRUD ---

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNewCourse(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setCurrentId(course.id!);
    setNewCourse({
      Categorie: course.Categorie,
      Description: course.Description,
      FormateurId: course.FormateurId,
      Published: course.Published,
      URL_image: course.URL_image,
      title: course.title,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Supprimer ce module définitivement ?")) {
      try {
        await FirestoreService.deleteCourse(id);
        fetchData(); // Rafraîchir la liste
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && currentId) {
        // UPDATE
        await FirestoreService.updateCourse(currentId, newCourse);
      } else {
        // CREATE
        await FirestoreService.addCourse(newCourse);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <header style={styles.header}>
        <div style={styles.maxContainer}>
          <div style={styles.headerContent}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => setIsDrawerOpen(true)} style={styles.menuBtn}>
                <Menu size={24} />
              </button>
              <div style={styles.logoGroup} onClick={() => navigate('/')}>
                <BookOpen size={32} color="#4f46e5" />
                <span style={styles.logoText}>EduFlow Anglais</span>
              </div>
            </div>
            
            <div style={styles.userSection}>
              <button onClick={handleOpenAdd} style={styles.addButton}>
                <Plus size={18} /> Nouveau Module
              </button>
              <Link to="/profile" style={styles.profileLink}>
                <UserCircle size={28} color="#64748b" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.maxContainerMain}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Modules d'Anglais</h2>
          <p style={{color: '#64748b'}}>Gestion de l'inventaire des cours de langue</p>
        </div>
        
        {loading ? (
          <div style={styles.loaderContainer}><Loader2 className="animate-spin" size={40} color="#4f46e5" /></div>
        ) : (
          <div style={styles.courseGrid}>
            {courses.map((course) => (
              <div key={course.id} style={styles.courseCard}>
                <div style={styles.imageBox}>
                  {course.URL_image ? (
                    <img src={course.URL_image} style={styles.img} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon size={40} color="#cbd5e1" />
                  )}
                  
                  {/* BOUTONS D'ACTION (EDIT/DELETE) */}
                  <div style={styles.actionOverlay}>
                    <button onClick={(e) => handleOpenEdit(e, course)} style={styles.iconBtnEdit} title="Modifier">
                      <Pencil size={14} />
                    </button>
                    <button onClick={(e) => handleDelete(e, course.id!)} style={styles.iconBtnDelete} title="Supprimer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{course.title}</h3>
                  <p style={styles.cardDesc}>{course.Description}</p>
                  <div style={styles.cardFooter}>
                    <div style={styles.footerItem}>
                      <User size={14} style={{marginRight: '5px'}} />
                      <span>Prof ID: {course.FormateurId}</span>
                    </div>
                    <Link to={`/modules/${course.title}`} style={styles.viewLink}>
                      Détails <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL AJOUT/EDIT */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              style={styles.modalContent}
            >
              <div style={styles.modalHeader}>
                <h3 style={{margin: 0}}>{isEditing ? "Modifier le module" : "Nouveau module d'anglais"}</h3>
                <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><X /></button>
              </div>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                  placeholder="Titre du cours" 
                  style={styles.input} 
                  value={newCourse.title} 
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})} 
                  required 
                />
                
                <div style={{ position: 'relative' }}>
                  <Tag size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    placeholder="Catégorie" 
                    style={{ ...styles.input, paddingLeft: '40px' }} 
                    value={newCourse.Categorie} 
                    disabled 
                  />
                </div>

                <textarea 
                  placeholder="Description..." 
                  style={{...styles.input, height: '80px'}} 
                  value={newCourse.Description} 
                  onChange={e => setNewCourse({...newCourse, Description: e.target.value})} 
                  required 
                />
                
                <input 
                  type="number" 
                  placeholder="ID Formateur" 
                  style={styles.input} 
                  value={newCourse.FormateurId} 
                  onChange={e => setNewCourse({...newCourse, FormateurId: parseInt(e.target.value) || 0})} 
                  required 
                />
                
                <input 
                  placeholder="URL de l'image" 
                  style={styles.input} 
                  value={newCourse.URL_image} 
                  onChange={e => setNewCourse({...newCourse, URL_image: e.target.value})} 
                />
                
                <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    isEditing ? "Mettre à jour" : "Créer le module"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Styles inchangés (gardés pour compatibilité)
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  header: { backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50 },
  maxContainer: { maxWidth: '1400px', margin: '0 auto' },
  headerContent: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  menuBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoText: { fontSize: '18px', fontWeight: 800, color: '#1e293b' },
  userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  addButton: { padding: '10px 16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' },
  profileLink: { display: 'flex', alignItems: 'center' },
  maxContainerMain: { maxWidth: '1400px', margin: '30px auto', padding: '0 20px' },
  sectionHeader: { marginBottom: '30px' },
  sectionTitle: { fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 },
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  courseCard: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative', transition: 'transform 0.2s' },
  imageBox: { height: '180px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  actionOverlay: { position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' },
  iconBtnEdit: { backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#4f46e5', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  iconBtnDelete: { backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cardBody: { padding: '20px' },
  cardTitle: { fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' },
  cardDesc: { fontSize: '14px', color: '#64748b', lineBreak: 'anywhere' },
  cardFooter: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerItem: { display: 'flex', alignItems: 'center', fontSize: '13px', color: '#64748b', fontWeight: 500 },
  viewLink: { display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', textDecoration: 'none', fontSize: '14px', fontWeight: 600 },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modalContent: { backgroundColor: '#fff', width: '95%', maxWidth: '480px', padding: '30px', borderRadius: '20px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  submitBtn: { padding: '16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, marginTop: '10px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' },
  loaderContainer: { display: 'flex', justifyContent: 'center', padding: '100px' }
};

export default AnglaisModules;