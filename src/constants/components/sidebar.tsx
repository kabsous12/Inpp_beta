import React from 'react-native';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Home, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '../../services/AuthService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tableau de bord', icon: <Home size={20} />, path: '/' },
    { name: 'Mon Profil', icon: <User size={20} />, path: '/profile' },
    { name: 'Formations', icon: <BookOpen size={20} />, path: '/' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fond sombre cliquable pour fermer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            style={styles.overlay} 
          />

          {/* Panneau latéral */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={styles.drawer}
          >
            <div style={styles.drawerHeader}>
              <div style={styles.logo}>
                <BookOpen size={24} color="#4f46e5" />
                <span style={styles.logoText}>EduFlow</span>
              </div>
              <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
            </div>

            <nav style={styles.nav}>
              {menuItems.map((item) => (
                <Link key={item.name} to={item.path} style={styles.navLink} onClick={onClose}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <button 
              onClick={() => { AuthService.logout(); navigate('/login'); }} 
              style={styles.logoutBtn}
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1000, backdropFilter: 'blur(2px)' },
  drawer: { position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px', backgroundColor: '#fff', zIndex: 1001, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.05)' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontWeight: 800, fontSize: '18px', color: '#1e293b' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  navLink: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', textDecoration: 'none', color: '#475569', fontWeight: 600, borderRadius: '8px', transition: 'all 0.2s' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, marginTop: 'auto' }
};

export default Sidebar;