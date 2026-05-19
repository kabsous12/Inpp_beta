import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Catalog from '../screens/Catalog';
import ModulePage from '../constants/ModulePage';

// Composant fictif ou de redirection temporaire pour la vue des leçons d'un module
const LessonsPlaceholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-800">Espace de cours / Leçons</h1>
        <p className="text-sm text-slate-500 mt-2">Le contenu des leçons de ce module sera chargé ici.</p>
      </div>
    </div>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ROUTES D'AUTHENTIFICATION */}
        {/* Page par défaut redirigeant vers le Login ou le Catalogue si connecté */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ESPACE PRINCIPAL / CATALOGUE */}
        <Route path="/catalog" element={<Catalog />} />

        {/* ROUTES DYNAMIQUES POUR LES MODULES ET LEÇONS */}
        {/* Affiche la liste des modules d'une discipline spécifique */}
        <Route path="/modules/:title" element={<ModulePage />} />

        {/* Affiche l'espace de cours / leçons pour un module particulier */}
        <Route path="/modules/:categoryId/:moduleId/lessons" element={<LessonsPlaceholder />} />

        {/* ROUTE DE SECOURS (404) - Redirige vers l'accueil en cas d'URL inconnue */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppNavigator;