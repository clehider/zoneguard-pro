import { google } from 'googleapis';

class GoogleSheetsService {
  constructor() {
    this.sheets = google.sheets('v4');
    this.spreadsheetId = process.env.REACT_APP_SPREADSHEET_ID;
  }

  async initializeSheets() {
    try {
      // Definir las hojas necesarias
      const sheets = [
        {
          properties: {
            title: 'Patrullas',
            gridProperties: {
              rowCount: 1000,
              columnCount: 10
            }
          },
          data: [{
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: 'ID' } },
                { userEnteredValue: { stringValue: 'Fecha' } },
                { userEnteredValue: { stringValue: 'Hora' } },
                { userEnteredValue: { stringValue: 'Ubicación' } },
                { userEnteredValue: { stringValue: 'Latitud' } },
                { userEnteredValue: { stringValue: 'Longitud' } },
                { userEnteredValue: { stringValue: 'Estado' } },
                { userEnteredValue: { stringValue: 'Observaciones' } }
              ]
            }]
          }]
        },
        {
          properties: {
            title: 'Incidentes',
            gridProperties: {
              rowCount: 1000,
              columnCount: 12
            }
          },
          data: [{
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: 'ID' } },
                { userEnteredValue: { stringValue: 'Fecha' } },
                { userEnteredValue: { stringValue: 'Hora' } },
                { userEnteredValue: { stringValue: 'Tipo' } },
                { userEnteredValue: { stringValue: 'Descripción' } },
                { userEnteredValue: { stringValue: 'Ubicación' } },
                { userEnteredValue: { stringValue: 'Latitud' } },
                { userEnteredValue: { stringValue: 'Longitud' } },
                { userEnteredValue: { stringValue: 'Estado' } }
              ]
            }]
          }]
        }
      ];

      // Crear las hojas
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: sheets.map(sheet => ({
            addSheet: {
              properties: sheet.properties
            }
          }))
        }
      });

      return true;
    } catch (error) {
      console.error('Error al inicializar las hojas:', error);
      return false;
    }
  }

  async addRecord(sheetName, data) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [Object.values(data)]
        }
      });
      return true;
    } catch (error) {
      console.error('Error al agregar registro:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();