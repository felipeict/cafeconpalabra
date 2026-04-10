import { google } from "googleapis";

export interface GoogleSheetsConfig {
  serviceAccountEmail: string;
  privateKey: string;
  spreadsheetId: string;
}

export class GoogleSheetsClient {
  private sheets;
  private spreadsheetId: string;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;

    // Configurar autenticación con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.serviceAccountEmail,
        private_key: config.privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async readRange(range: string): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      return response.data.values || [];
    } catch (error) {
      console.error("Error reading from Google Sheets:", error);
      throw new Error("Failed to read data from Google Sheets");
    }
  }

  async appendRow(range: string, values: any[]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      });
    } catch (error) {
      console.error("Error appending to Google Sheets:", error);
      throw new Error("Failed to append data to Google Sheets");
    }
  }

  async updateCell(range: string, value: any): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[value]],
        },
      });
    } catch (error) {
      console.error("Error updating Google Sheets:", error);
      throw new Error("Failed to update data in Google Sheets");
    }
  }
}
