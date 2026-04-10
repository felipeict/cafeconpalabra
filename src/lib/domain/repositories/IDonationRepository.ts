import type { Donation } from "../entities/Donation";

export interface IDonationRepository {
  getAll(): Promise<Donation[]>;
  getByDateRange(startDate: string, endDate: string): Promise<Donation[]>;
}
