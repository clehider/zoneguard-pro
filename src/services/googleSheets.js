import { google } from 'googleapis';
import { SCOPES, SPREADSHEET_CONFIG } from '../config/google-config';

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.auth = null;
  }

  async initialize(auth) {
    this.auth = auth;
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async readSheet() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
        range: SPREADSHEET_CONFIG.range,
      });
      return response.data.values;
    } catch (error) {
      console.error('Error al leer la hoja de cálculo:', error);
      throw error;
    }
  }

  async appendRow(values) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
        range: SPREADSHEET_CONFIG.range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar fila:', error);
      throw error;
    }
  }

  async updateRow(range, values) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
        range: `${SPREADSHEET_CONFIG.range}!${range}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar fila:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();