export const googleConfig = {
  apiVersion: 'v4',
  scope: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ],
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  useBrowserFetch: true,
  browserPolyfills: true
};