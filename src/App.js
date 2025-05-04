import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import IncidentForm from './components/IncidentForm';
import GuardsManager from './components/GuardsManager';
import ZoneCreator from './components/ZoneCreator';
import IncidentList from './components/IncidentList';
import { sheetsService } from './services/sheetsService';
import GoogleAuth from './components/GoogleAuth';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [currentModule, setCurrentModule] = useState('incidents');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = (userData) => {
    console.log('Authentication successful:', userData);
    setIsAuthenticated(true);
  };

  const handleAuthFailure = (error) => {
    console.error('Authentication failed:', error);
    setIsAuthenticated(false);
  };

  const handleSaveIncident = async (incidentData) => {
    const values = [
      new Date().toLocaleString(),
      incidentData.type || '',
      incidentData.description || '',
      incidentData.location?.lat || '',
      incidentData.location?.lng || '',
      incidentData.status || 'Pendiente',
      incidentData.assignedTo || '',
    ];

    try {
      const result = await sheetsService.addRecord('Incidentes', values);
      console.log('Incidente guardado:', result);
      alert('Incidente registrado con éxito');
      
      const updatedIncidents = await sheetsService.getRecords('Incidentes');
      setIncidents(updatedIncidents);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`Error al guardar el incidente: ${error.message}`);
    }
  };

  const renderCurrentModule = () => {
    switch(currentModule) {
      case 'incidents':
        return (
          <div className="flex flex-1 h-full">
            <div className="w-1/2 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              <div className="p-4">
                <IncidentForm onSave={handleSaveIncident} />
                <div className="mt-4">
                  <IncidentList 
                    incidents={incidents} 
                    onIncidentSelect={(incident) => {
                      // Manejar la selección de incidente
                    }} 
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 relative">
              <MapComponent 
                incidents={incidents}
                onLocationSelect={(location) => {
                  // Manejar la selección de ubicación
                }}
              />
            </div>
          </div>
        );
      case 'guards':
        return <GuardsManager guards={[]} setGuards={() => {}} saveData={() => {}} />;
      case 'zones':
        return <ZoneCreator zones={[]} setZones={() => {}} saveData={() => {}} />;
      default:
        return <div>Seleccione un módulo</div>;
    }
  };

  return (
    <div className="App flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">ZoneGuard Pro - Panel de Control</h1>
        {/* Activamos el componente de autenticación */}
        <GoogleAuth 
          onAuthSuccess={handleAuthSuccess}
          onAuthFailure={handleAuthFailure}
        />
      </header>

      {/* Mostramos contenido solo si está autenticado */}
      {isAuthenticated ? (
        <>
          <nav className="bg-gray-100 p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentModule('incidents')}
                className={`px-4 py-2 rounded ${currentModule === 'incidents' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Incidentes
              </button>
              <button
                onClick={() => setCurrentModule('guards')}
                className={`px-4 py-2 rounded ${currentModule === 'guards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Guardias
              </button>
              <button
                onClick={() => setCurrentModule('zones')}
                className={`px-4 py-2 rounded ${currentModule === 'zones' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Zonas
              </button>
            </div>
          </nav>
          <main className="flex-1 overflow-hidden">
            {renderCurrentModule()}
          </main>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Por favor inicia sesión con Google</p>
        </div>
      )}

      <footer className="bg-gray-200 text-center p-2 text-sm">
        © 2023 ZoneGuard Pro
      </footer>
    </div>
  );
}

export default App;

// DONE