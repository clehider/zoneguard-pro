import { SPREADSHEET_ID, API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '../config/google';

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

class SheetsService {
  constructor() {
    this.accessToken = null;
    this.spreadsheetId = '18p6GZI13OgUssecIH21PjPvApTAa9VOWnEHGYfp9EEs';
    this.apiKey = 'AIzaSyAgLNdE8AzuxsQL4hzKg94Z65cFuNWTQfo';
    this.sheets = {
      incidentes: {
        name: 'Incidentes',
        columns: ['Fecha y Hora', 'Tipo de Incidente', 'Descripción', 'Latitud', 'Longitud', 'Estado', 'Asignado a']
      },
      guardias: {
        name: 'Guardias',
        columns: ['ID', 'Nombre', 'Apellido', 'DNI', 'Teléfono', 'Email', 'Estado', 'Turno', 'Zona Asignada', 'Fecha de Ingreso', 'Observaciones']
      },
      zonas: {
        name: 'Zonas',
        columns: ['ID', 'Nombre de Zona', 'Descripcion', 'Latitud', 'Longitud', 'Estado', 'Guardia Asignado', 'Fecha de Creación', 'Nivel de Riesgo', 'Observaciones']
      },
      patrullas: {
        name: 'Patrullas',
        columns: ['ID', 'Fecha', 'Hora', 'Ubicacion', 'Latitud', 'Longitud', 'Estado', 'Observaciones']
      }
    };
    console.log('SheetsService inicializado correctamente');
  }

  async init() {
    try {
      await gapi.client.init({
        apiKey: this.apiKey,
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
      });
      
      // Inicializar las hojas necesarias
      for (const sheetKey in this.sheets) {
        const sheet = this.sheets[sheetKey];
        await this.initSheet(sheet.name, sheet.columns);
      }
      
      return true;
    } catch (error) {
      console.error('Error al inicializar SheetsService:', error);
      return false;
    }
  }

  async initSheet(sheetName, headers) {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      
      const sheetExists = response.data.sheets.some(sheet => sheet.properties.title === sheetName);
      
      if (!sheetExists) {
        await gapi.client.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: headers.length,
                  }
                }
              }
            }]
          }
        });
        
        await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Error al inicializar hoja:', error);
      return false;
    }
  }

  isInitialized() {
    return !!this.accessToken;
  }

  async addRecord(sheetName, values) {
    if (!this.isInitialized()) {
      throw new Error('SheetsService: El servicio no está inicializado.');
    }

    const sheet = this.sheets[sheetName.toLowerCase()];
    if (!sheet) {
      throw new Error(`Hoja "${sheetName}" no encontrada.`);
    }

    const range = `${sheet.name}!A:A`;
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

  async getRecords(sheetName, range = 'A1:Z1000') {
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

// Change the export statement to export the class instance as a named export
export const sheetsService = new SheetsService();