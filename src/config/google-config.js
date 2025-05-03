// Configuración para la autenticación de Google y Google Sheets API
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];

export const CREDENTIALS_PATH = './credentials.json';
export const TOKEN_PATH = './token.json';

// Configuración para la hoja de cálculo
export const SPREADSHEET_CONFIG = {
  spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
  range: 'Patrullas!A:Z' // Ajusta el rango según tus necesidades
};