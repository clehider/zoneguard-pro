// import { google } from 'googleapis'; // No usaremos la librería de Node.js en el frontend
// import { authenticate } from '@google-cloud/local-auth'; // No usar en frontend
// import path from 'path'; // No usar en frontend
// import { Buffer } from 'buffer'; // No necesario si no manipulas buffers directamente aquí
// import { config } from '../config/google'; // Asegúrate que este archivo solo contenga SPREADSHEET_ID

// Solo necesitamos el ID de la hoja desde la configuración
import { SPREADSHEET_ID, API_KEY } from '../config/google'; // Asumiendo que google.js exporta SPREADSHEET_ID

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

class SheetsService {
  constructor() {
    this.accessToken = null;
    this.spreadsheetId = SPREADSHEET_ID;
    this.apiKey = API_KEY;
  }

  // Método para inicializar el servicio con el token
  init(accessToken) {
    if (!accessToken) {
      console.error('SheetsService: Se requiere Access Token para inicializar.');
      return false;
    }
    this.accessToken = accessToken;
    console.log('SheetsService inicializado con Access Token.');
    return true;
  }

  isInitialized() {
    return !!this.accessToken;
  }

  // Método para añadir una fila de datos
  async addRecord(sheetName, values) {
    if (!this.isInitialized()) {
      throw new Error('SheetsService: El servicio no está inicializado.');
    }

    const range = `${sheetName}!A:A`; // Usar A:A para que se añada al final
    const valueInputOption = 'USER_ENTERED';
    const insertDataOption = 'INSERT_ROWS';

    const body = {
      values: [values],
      majorDimension: 'ROWS'
    };

    try {
      const response = await fetch(
        `${SHEETS_API_URL}/${this.spreadsheetId}/values/${range}:append?valueInputOption=${valueInputOption}&insertDataOption=${insertDataOption}&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al guardar: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en addRecord:', error);
      throw error;
    }
  }

  // Puedes añadir más métodos aquí (getRecords, updateRecord, etc.)
  // Ejemplo básico para obtener datos:
  async getRecords(sheetName, range = 'A1:Z1000') { // Rango por defecto amplio
     if (!this.isInitialized()) {
       console.error('SheetsService: El servicio no está inicializado.');
       return null;
     }
     if (!sheetName) {
       console.error('SheetsService: Nombre de hoja requerido para getRecords.');
       return null;
     }

     const fullRange = `${sheetName}!${range}`;

     try {
       const response = await fetch(
         `${SHEETS_API_URL}/${this.spreadsheetId}/values/${encodeURIComponent(fullRange)}`,
         {
           method: 'GET',
           headers: {
             'Authorization': `Bearer ${this.accessToken}`,
           },
         }
       );

       if (!response.ok) {
         const errorData = await response.json();
         console.error('Sheets API Error:', errorData);
         throw new Error(`Error al obtener registros: ${errorData.error?.message || response.statusText}`);
       }

       const result = await response.json();
       console.log('Registros obtenidos:', result.values);
       return result.values || []; // Devuelve las filas o un array vacío

     } catch (error) {
       console.error('Error en getRecords:', error);
       return null;
     }
   }

}

// Exportar una instancia única (singleton)
export const sheetsService = new SheetsService();


const initSheet = async (sheetName) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const sheetExists = response.data.sheets.some(sheet => sheet.properties.title === sheetName);
    
    if (!sheetExists) {
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 10,
                }
              }
            }
          }]
        }
      });
      
      // Agregar encabezados
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:H1`,
        valueInputOption: 'RAW',
        resource: {
          values: [['Fecha', 'Tipo', 'Descripción', 'Latitud', 'Longitud', 'Estado', 'Asignado a', 'Comentarios']]
        }
      });
    }
    return true;
  } catch (error) {
    console.error('Error al inicializar hoja:', error);
    return false;
  }
};