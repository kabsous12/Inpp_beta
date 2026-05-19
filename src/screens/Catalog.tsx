import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FirestoreService } from '../services/FirestoreService';
import { AuthService } from '../services/AuthService'; 
import Sidebar from '../constants/components/sidebar';
import { 
  BookOpen, Plus, X, Image as ImageIcon, Menu,
  Loader2, User, Filter, Tag, ChevronRight,
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{fullname: string, email: string} | null>(null);
  
  // États UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  const initialFormState = {
    Categorie: '',
    Description: '',
    FormateurId: 0,
    Published: true,
    URL_image: '',
    title: ''
  };

  const [formCourse, setFormCourse] = useState<Omit<Course, 'id'>>(initialFormState);

  useEffect(() => {
    fetchData();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const currentUser = AuthService.getCurrentUser(); 
    if (currentUser) {
      setUser({
        fullname: currentUser.displayName || "Utilisateur",
        email: currentUser.email || ""
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await FirestoreService.getCourses();
      setCourses(data as Course[] || []);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE CRUD ---
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setFormCourse(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setCurrentCourseId(course.id!);
    setFormCourse({
      Categorie: course.Categorie,
      Description: course.Description,
      FormateurId: course.FormateurId,
      Published: course.Published,
      URL_image: course.URL_image,
      title: course.title
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Supprimer ce cours et ses modules ?")) {
      try {
        await FirestoreService.deleteCourse(courseId);
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && currentCourseId) {
        await FirestoreService.updateCourse(currentCourseId, formCourse);
      } else {
        await FirestoreService.addCourse(formCourse);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicCategories = useMemo(() => {
    const cats = courses.map(c => c.Categorie).filter(c => c && c.trim() !== '');
    return ['Tous', ...Array.from(new Set(cats))];
  }, [courses]);

  const filteredCourses = selectedCategory === 'Tous' 
    ? courses 
    : courses.filter(c => c.Categorie === selectedCategory);

  return (
    <div style={styles.pageContainer}>
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* HEADER : Logo + Profil Utilisateur */}
      <header style={styles.header}>
        <div style={styles.maxContainer}>
          <div style={styles.headerContent}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => setIsDrawerOpen(true)} style={styles.menuBtn}>
                <Menu size={24} />
              </button>
              <div style={styles.logoGroup} onClick={() => navigate('/')}>
                <BookOpen size={32} color="#4f46e5" />
                <span style={styles.logoText}>EduFlow Admin</span>
              </div>
            </div>
            
            <div style={styles.userSection}>
              {user && (
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user.fullname}</span>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>
              )}
              <Link to="/profile" style={styles.profileLink}>
                <div style={styles.avatarCircle}>
                   <User size={20} color="#4f46e5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.maxContainerMain}>
        {/* LIGNE D'ACTION : Titre + Nouveau Cours */}
        <div style={styles.mainActionRow}>
          <h2 style={styles.sectionTitle}>Catalogue des Cours</h2>
          <button onClick={handleOpenAdd} style={styles.addButton}>
            <Plus size={18} /> Nouveau Cours
          </button>
        </div>

        {/* FILTRES */}
        <div style={styles.sectionHeader}>
          <div style={styles.filterBar}>
            <Filter size={16} color="#64748b" style={{ marginRight: '8px' }} />
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterChip,
                  backgroundColor: selectedCategory === cat ? '#4f46e5' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748b',
                  border: selectedCategory === cat ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div style={styles.loaderContainer}><Loader2 className="animate-spin" size={40} color="#4f46e5" /></div>
        ) : (
          <div style={styles.courseGrid}>
            {filteredCourses.map((course) => (
              <div key={course.id} style={{ position: 'relative' }}>
                <Link to={`/modules/${course.title}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div whileHover={{ y: -5 }} style={styles.courseCard}>
                    <div style={styles.imageBox}>
                      {course.URL_image ? (
                        <img src={course.URL_image} style={styles.img} alt="" />
                      ) : (
                        <ImageIcon size={40} color="#cbd5e1" />
                      )}
                      <div style={styles.categoryBadge}>{course.Categorie}</div>
                      
                      {/* ACTIONS RAPIDES */}
                      <div style={styles.actionOverlay}>
                        <button onClick={(e) => handleOpenEdit(e, course)} style={styles.iconBtnEdit}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={(e) => handleDelete(e, course.id!)} style={styles.iconBtnDelete}>
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
                          <span>Formateur: {course.FormateurId}</span>
                        </div>
                        <ChevronRight size={16} color="#4f46e5" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL AJOUT/EDITION */}
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
                <h3 style={{margin: 0}}>{isEditing ? "Modifier le cours" : "Nouveau Cours"}</h3>
                <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><X /></button>
              </div>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                  placeholder="Titre du cours" 
                  style={styles.input} 
                  value={formCourse.title} 
                  onChange={e => setFormCourse({...formCourse, title: e.target.value})} 
                  required 
                />
                <div style={{ position: 'relative' }}>
                  <Tag size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  <input 
                    placeholder="Catégorie" 
                    style={{ ...styles.input, paddingLeft: '40px' }} 
                    value={formCourse.Categorie} 
                    onChange={e => setFormCourse({...formCourse, Categorie: e.target.value})} 
                    required 
                  />
                </div>
                <textarea 
                  placeholder="Description" 
                  style={{...styles.input, height: '80px'}} 
                  value={formCourse.Description} 
                  onChange={e => setFormCourse({...formCourse, Description: e.target.value})} 
                  required 
                />
                <input 
                  type="number" 
                  placeholder="ID Formateur" 
                  style={styles.input} 
                  value={formCourse.FormateurId} 
                  onChange={e => setFormCourse({...formCourse, FormateurId: parseInt(e.target.value) || 0})} 
                  required 
                />
                <input 
                  placeholder="URL de l'image" 
                  style={styles.input} 
                  value={formCourse.URL_image} 
                  onChange={e => setFormCourse({...formCourse, URL_image: e.target.value})} 
                />
                <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (isEditing ? "Enregistrer" : "Créer le cours")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', position: 'sticky', top: 0, zIndex: 50 },
  maxContainer: { maxWidth: '1400px', margin: '0 auto' },
  headerContent: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  menuBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoText: { fontSize: '20px', fontWeight: 800, color: '#1e293b' },
  
  // Section Utilisateur
  userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  userInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' },
  userName: { fontSize: '14px', fontWeight: 700, color: '#1e293b' },
  userEmail: { fontSize: '12px', color: '#64748b' },
  avatarCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0ff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #e2e8f0' },
  profileLink: { textDecoration: 'none' },

  // Contenu Principal
  maxContainerMain: { maxWidth: '1400px', margin: '30px auto', padding: '0 20px' },
  mainActionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  sectionTitle: { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 },
  addButton: { padding: '12px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' },
  
  sectionHeader: { marginBottom: '30px' },
  filterBar: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  filterChip: { padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: '0.2s' },
  
  // Grille et Cartes
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  courseCard: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  imageBox: { height: '180px', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  categoryBadge: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#fff', color: '#4f46e5', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 },
  actionOverlay: { position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' },
  iconBtnEdit: { backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#4f46e5', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  iconBtnDelete: { backgroundColor: '#fff', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  
  cardBody: { padding: '20px' },
  cardTitle: { fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: '#1e293b' },
  cardDesc: { fontSize: '14px', color: '#64748b', marginBottom: '20px', height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  footerItem: { display: 'flex', alignItems: 'center', fontSize: '13px', color: '#64748b' },
  
  // Modal
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '500px', padding: '30px', borderRadius: '20px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  input: { padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  submitBtn: { padding: '16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  loaderContainer: { display: 'flex', justifyContent: 'center', padding: '100px' }
};

export default Dashboard;