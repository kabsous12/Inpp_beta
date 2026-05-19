import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, GraduationCap, Github } from 'lucide-react';
import { AuthService } from '../services/AuthService';

// Composants d'icônes SVG simples pour Google et GitHub
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => <Github size={18} />;

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // États pour le formulaire standard
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connexion Classique (Email + MDP)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.login(email, password);
      navigate('/catalog');
    } catch (err: any) {
      setError("Identifiants incorrects ou invalides.");
    } finally {
      setLoading(false);
    }
  };

  // Connexion via Google
  const handleGoogleLogin = async () => {
    setError(null);
    setSocialLoading('google');
    try {
      await AuthService.loginWithGoogle();
      navigate('/catalog');
    } catch (err: any) {
      setError("Échec de la connexion avec Google.");
    } finally {
      setSocialLoading(null);
    }
  };

  // Connexion via GitHub
  const handleGithubLogin = async () => {
    setError(null);
    setSocialLoading('github');
    try {
      await AuthService.loginWithGithub();
      navigate('/catalog');
    } catch (err: any) {
      setError("Échec de la connexion avec GitHub.");
    } finally {
      setSocialLoading(null);
    }
  };

  const isAnyLoading = loading || socialLoading !== null;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        
        {/* LOGO ET EN-TÊTE */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <GraduationCap size={32} color="#fff" />
          </div>
          <h2 style={styles.title}>Bienvenue</h2>
          <p style={styles.subtitle}>Accédez à votre espace d'apprentissage</p>
        </div>

        {/* MESSAGE D'ERREUR */}
        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {/* FORMULAIRE EMAIL/MDP */}
        <form onSubmit={handleEmailSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse e-mail</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input 
                type="email"
                style={styles.input}
                placeholder="exemple@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAnyLoading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input 
                type="password"
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isAnyLoading}
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={isAnyLoading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <LogIn size={18} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* SÉPARATEUR */}
        <div style={styles.separatorContainer}>
          <div style={styles.separatorLine} />
          <span style={styles.separatorText}>ou continuer avec</span>
          <div style={styles.separatorLine} />
        </div>

        {/* BOUTONS SOCIAUX */}
        <div style={styles.socialGroup}>
          <button 
            onClick={handleGoogleLogin} 
            style={styles.socialBtn} 
            disabled={isAnyLoading}
          >
            {socialLoading === 'google' ? (
              <Loader2 className="animate-spin" size={18} color="#64748b" />
            ) : (
              <>
                <GoogleIcon />
                <span>Google</span>
              </>
            )}
          </button>

          <button 
            onClick={handleGithubLogin} 
            style={styles.socialBtn} 
            disabled={isAnyLoading}
          >
            {socialLoading === 'github' ? (
              <Loader2 className="animate-spin" size={18} color="#64748b" />
            ) : (
              <>
                <GithubIcon />
                <span>GitHub</span>
              </>
            )}
          </button>
        </div>

        {/* LIEN DE REDIRECTION VERS L'INSCRIPTION */}
        <div style={styles.footerContainer}>
          <span style={styles.footerText}>Vous n'avez pas de compte ? </span>
          <button 
            onClick={() => navigate('/register')} 
            style={styles.registerLink}
            disabled={isAnyLoading}
          >
            S'inscrire
          </button>
        </div>

      </div>
    </div>
  );
};

// --- FEUILLE DE STYLES EN LIGNE ---
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    backgroundColor: '#4f46e5',
    padding: '12px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#1e293b',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: '#94a3b8',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 44px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#fdfdfd',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    marginTop: '6px',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
  },
  separatorContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '10px',
  },
  separatorLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  separatorText: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: 500,
  },
  socialGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  socialBtn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    color: '#334155',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footerContainer: {
    textAlign: 'center',
    fontSize: '14px',
  },
  footerText: {
    color: '#64748b',
  },
  registerLink: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'none',
  },
};

export default Login;