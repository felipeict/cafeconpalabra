import type { IDonationRepository } from "../../domain/repositories/IDonationRepository";
import { Donation } from "../../domain/entities/Donation";
import type { GoogleSheetsClient } from "../config/GoogleSheetsClient";

export class GoogleSheetsDonationRepository implements IDonationRepository {
  private readonly SHEET_NAME = "Donaciones";

  constructor(private sheetsClient: GoogleSheetsClient) {}

  async getAll(): Promise<Donation[]> {
    const rows = await this.sheetsClient.readRange(`${this.SHEET_NAME}!A2:C`);

    return rows.map(
      (row) =>
        new Donation(
          row[0], // fecha
          parseFloat(row[1]), // monto
          row[2], // nombre
        ),
    );
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Donation[]> {
    const donations = await this.getAll();
    return donations.filter((d) => d.fecha >= startDate && d.fecha <= endDate);
  }
}
