import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import IncidentForm from './components/IncidentForm';
import GuardsManager from './components/GuardsManager';
import ZoneCreator from './components/ZoneCreator';
import PointCreator from './components/PointCreator';
import IncidentList from './components/IncidentList';
import { incidentService } from './services/incidentService';
import { zoneService } from './services/zoneService';
import { guardService } from './services/guardService';
import { pointService } from './services/pointService';
import './config/firebase';
import RoundValidator from './components/RoundValidator';


function App() {
  const [incidents, setIncidents] = useState([]);
  const [zones, setZones] = useState([]);
  const [guards, setGuards] = useState([]);
  const [points, setPoints] = useState([]);
  const [currentModule, setCurrentModule] = useState('incidents');
  
  useEffect(() => {
    let isMounted = true;
  
    const initializeApp = async () => {
      try {
        console.log('Iniciando aplicación...');
        if (isMounted) {
          const [updatedIncidents, updatedZones, updatedGuards, updatedPoints] = await Promise.all([
            incidentService.getIncidents(),
            zoneService.getZones(),
            guardService.getGuards(),
            pointService.getPoints()
          ]);
          
          setIncidents(updatedIncidents);
          setZones(updatedZones);
          setGuards(updatedGuards);
          setPoints(updatedPoints);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error al inicializar la aplicación:', error);
          alert('Error al cargar la aplicación. Por favor, recarga la página.');
        }
      }
    };
  
    initializeApp();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveIncident = async (incidentData) => {
    try {
      await incidentService.addIncident(incidentData);
      const updatedIncidents = await incidentService.getIncidents();
      setIncidents(updatedIncidents);
      alert('Incidente registrado con éxito');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(`Error al guardar el incidente: ${error.message}`);
    }
  };

  const handleSaveZone = async (zoneData) => {
    try {
      await zoneService.addZone(zoneData);
      const updatedZones = await zoneService.getZones();
      setZones(updatedZones);
      alert('Zona registrada con éxito');
    } catch (error) {
      console.error('Error al guardar zona:', error);
      alert(`Error al guardar la zona: ${error.message}`);
    }
  };

  const handleSaveGuard = async (guardData) => {
    try {
      await guardService.addGuard(guardData);
      const updatedGuards = await guardService.getGuards();
      setGuards(updatedGuards);
      alert('Guardia registrado con éxito');
    } catch (error) {
      console.error('Error al guardar guardia:', error);
      alert(`Error al guardar el guardia: ${error.message}`);
    }
  };

  const handleSavePoint = async (pointData) => {
    try {
      await pointService.addPoint(pointData);
      const updatedPoints = await pointService.getPoints();
      setPoints(updatedPoints);
      alert('Punto registrado con éxito');
    } catch (error) {
      console.error('Error al guardar punto:', error);
      alert(`Error al guardar el punto: ${error.message}`);
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
        return <GuardsManager 
          guards={guards} 
          setGuards={setGuards} 
          saveData={handleSaveGuard} 
        />;
      case 'zones':
        return <ZoneCreator 
          zones={zones} 
          setZones={setZones} 
          saveData={handleSaveZone} 
        />;
      case 'points':
        return <PointCreator 
          points={points}
          zones={zones}
          setPoints={setPoints}
          saveData={handleSavePoint}
        />;
      case 'rondero':
        return <RoundValidator 
          guards={guards}
          zones={zones}
          points={points}
        />;
      default:
        return <div>Seleccione un módulo</div>;
    }
  };

  return (
    <div className="App flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">ZoneGuard Pro - Panel de Control</h1>
      </header>

      <nav className="bg-gray-100 p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentModule('incidents')}
            className={`px-4 py-2 rounded font-medium ${currentModule === 'incidents' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Incidentes
          </button>
          <button
            onClick={() => setCurrentModule('guards')}
            className={`px-4 py-2 rounded font-medium ${currentModule === 'guards' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Guardias
          </button>
          <button
            onClick={() => setCurrentModule('zones')}
            className={`px-4 py-2 rounded font-medium ${currentModule === 'zones' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Zonas
          </button>
          <button
            onClick={() => setCurrentModule('points')}
            className={`px-4 py-2 rounded font-medium ${currentModule === 'points' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Puntos
          </button>
          <button
            onClick={() => setCurrentModule('rondero')}
            className={`px-4 py-2 rounded font-medium ${currentModule === 'rondero' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Rondero
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        {renderCurrentModule()}
      </main>

      <footer className="bg-gray-200 text-center p-2 text-sm">
        © 2023 ZoneGuard Pro
      </footer>
    </div>
  );
}

export default App;


// DONE