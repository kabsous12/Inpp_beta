import React from 'react';
import { useParams } from 'react-router-dom';

// Importe tes écrans spécifiques ici
import Anglais from '../screens/modules/Anglais';


// Objet de correspondance (Mapping)
const COMPONENT_MAP: { [key: string]: React.ReactNode } = {
  'anglais': <Anglais />,
  
};

const ModulePage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  
  // On transforme en minuscules pour éviter les erreurs de frappe (ex: "Anglais" vs "anglais")
  const normalizedTitle = title?.toLowerCase() || '';

  return (
    <div style={{ padding: '20px' }}>
      {/* Si le titre existe dans notre map, on affiche le composant, sinon un message d'erreur */}
      {COMPONENT_MAP[normalizedTitle] ? (
        COMPONENT_MAP[normalizedTitle]
      ) : (
        <div>
          <h1>Erreur</h1>
          <p>Le module "{title}" n'existe pas encore.</p>
        </div>
      )}
    </div>
  );
};

export default ModulePage; 