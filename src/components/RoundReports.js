import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const RoundReports = ({ validatedPoints, guards, zones, points }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        // Cargar datos de Firebase
        const validationsSnapshot = await getDocs(collection(db, 'validations'));
        const validations = validationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setHistoricalData(validations);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    };

    loadHistoricalData();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Reporte de Rondas', 20, 20);
    
    let yPos = 40;
    const allPoints = [...validatedPoints, ...historicalData];
    
    allPoints.forEach((validation, index) => {
      const guard = guards.find(g => g.id === validation.guardId);
      const zone = zones.find(z => z.id === validation.zoneId);
      const point = points.find(p => p.id === validation.pointId);
      
      const date = new Date(validation.timestamp);
      
      doc.setFontSize(12);
      doc.text(`Punto ${index + 1}:`, 20, yPos);
      doc.text(`Fecha: ${date.toLocaleDateString()}`, 20, yPos + 10);
      doc.text(`Hora: ${date.toLocaleTimeString()}`, 20, yPos + 20);
      doc.text(`Guardia: ${guard?.name || 'N/A'}`, 20, yPos + 30);
      doc.text(`Zona: ${zone?.name || 'N/A'}`, 20, yPos + 40);
      doc.text(`Punto: ${point?.name || 'N/A'}`, 20, yPos + 50);
      
      yPos += 70;
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    doc.save('reporte-rondas.pdf');
  };

  const generateExcelReport = () => {
    const allPoints = [...validatedPoints, ...historicalData];
    const data = allPoints.map(validation => {
      const guard = guards.find(g => g.id === validation.guardId);
      const zone = zones.find(z => z.id === validation.zoneId);
      const point = points.find(p => p.id === validation.pointId);
      const date = new Date(validation.timestamp);
      
      return {
        'Fecha': date.toLocaleDateString(),
        'Hora': date.toLocaleTimeString(),
        'Guardia': guard?.name || 'N/A',
        'Zona': zone?.name || 'N/A',
        'Punto': point?.name || 'N/A'
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rondas');
    XLSX.writeFile(wb, 'reporte-rondas.xlsx');
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Generar Reportes</h3>
      <div className="flex space-x-4">
        <button
          onClick={generatePDFReport}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Descargar PDF
        </button>
        <button
          onClick={generateExcelReport}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Descargar Excel
        </button>
      </div>
    </div>
  );
};

export default RoundReports;