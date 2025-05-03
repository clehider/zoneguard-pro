import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import IncidentForm from './components/IncidentForm';
import GoogleAuth from './components/GoogleAuth';
import GuardsManager from './components/GuardsManager';
import ZoneCreator from './components/ZoneCreator';
import IncidentList from './components/IncidentList'; // Agregar esta línea
import { sheetsService } from './services/sheetsService';
// Remove the './App.css' import since we're using Tailwind CSS

function App() {
  // Temporalmente establecemos isAuthenticated como true para desarrollo
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [currentModule, setCurrentModule] = useState('incidents');

  // Inicialización temporal del sheetsService
  useEffect(() => {
    sheetsService.init('AIzaSyAgLNdE8AzuxsQL4hzKg94Z65cFuNWTQfoI'); // Reemplazar con token real
  }, []);
  // Comentamos temporalmente las funciones de autenticación
  /*
  const handleAuthSuccess = (accessToken) => {
    console.log('App: Autenticación exitosa.');
    // Inicializar el servicio de Sheets con el token
    const initialized = sheetsService.init(accessToken);
    if (initialized) {
      setIsAuthenticated(true);
      // Opcional: Cargar datos iniciales si es necesario
      // loadInitialData();
    } else {
      console.error("App: No se pudo inicializar SheetsService.");
      // Manejar el error, quizás mostrar un mensaje al usuario
    }
  };

  // Callback para cuando la autenticación falla
  const handleAuthFailure = (error) => {
    console.error('App: Falló la autenticación.', error);
    setIsAuthenticated(false);
    // Limpiar cualquier estado relacionado con el usuario autenticado
  };
  */

  // Función para guardar datos (ahora usa sheetsService)
  const handleSaveIncident = async (incidentData) => {
    // Comentamos temporalmente la verificación de autenticación
    /*
    if (!isAuthenticated || !sheetsService.isInitialized()) {
      alert('Por favor, inicia sesión con Google primero.');
      return;
    }
    */

    const values = [
      new Date().toLocaleString(), // Fecha y hora
      incidentData.type || '',     // Tipo de incidente
      incidentData.description || '', // Descripción
      incidentData.location?.lat || '', // Latitud
      incidentData.location?.lng || '', // Longitud
      incidentData.status || 'Pendiente', // Estado del incidente
      incidentData.assignedTo || '', // Asignado a
    ];

    try {
      const result = await sheetsService.addRecord('Incidentes', values);
      console.log('Incidente guardado:', result);
      alert('Incidente registrado con éxito');
      
      // Actualizar la lista de incidentes
      const updatedIncidents = await sheetsService.getRecords('Incidentes');
      setIncidents(updatedIncidents);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`Error al guardar el incidente: ${error.message}`);
    }
  };

  // Opcional: Función para cargar datos iniciales
  // async function loadInitialData() {
  //   if (sheetsService.isInitialized()) {
  //     const data = await sheetsService.getRecords('Incidentes'); // Asume hoja 'Incidentes'
  //     if (data) {
  //       // Procesa los datos y actualiza el estado 'incidents'
  //       console.log("Datos cargados:", data);
  //       // setIncidents(processedData);
  //     }
  //   }
  // }

  // Función para renderizar el módulo actual
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
        {/* Comentamos temporalmente el componente de autenticación
        <GoogleAuth
          onAuthSuccess={handleAuthSuccess}
          onAuthFailure={handleAuthFailure}
        />
        */}
      </header>

      {/* Removemos temporalmente la condición de autenticación */}
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

      <footer className="bg-gray-200 text-center p-2 text-sm">
        © 2023 ZoneGuard Pro
      </footer>
    </div>
  );
}

export default App;

// DONE