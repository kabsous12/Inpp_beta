import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { Mail, Lock, UserPlus, Loader2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.register(email, password);
      navigate('/catalog');
    } catch (err: any) {
      setError(err.message || "Impossible de créer le compte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-5 font-sans">
      
      {/* EN-TÊTE ET LOGO */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center mb-7"
      >
        <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl shadow-md shadow-indigo-600/20 mb-4">
          <GraduationCap size={32} color="#fff" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Créer un compte
        </h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Rejoignez votre espace d'apprentissage en quelques clics
        </p>
      </motion.div>

      {/* CARTE DE FORMULAIRE */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="w-full max-w-md"
      >
        <div className="bg-white py-9 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-sm shadow-slate-100/50">
          
          {/* BANNIÈRE D'ERREUR */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3.5 rounded-xl mb-5 text-center font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* CHAMP EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600">
                Adresse e-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-60"
                  placeholder="exemple@domaine.com"
                />
              </div>
            </div>

            {/* CHAMP MOT DE PASSE */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-600">
                Mot de passe
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* BOUTON D'ENREGISTREMENT */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex justify-center items-center gap-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/10 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <UserPlus h-4 w-4 />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* SÉPARATEUR & LIEN DE RETOUR */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Vous avez déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                Connexion
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;