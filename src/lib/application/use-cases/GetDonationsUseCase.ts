import type { IDonationRepository } from "../../domain/repositories/IDonationRepository";
import type { Donation } from "../../domain/entities/Donation";

export class GetDonationsUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(startDate?: string, endDate?: string): Promise<Donation[]> {
    if (startDate && endDate) {
      return await this.donationRepository.getByDateRange(startDate, endDate);
    }

    return await this.donationRepository.getAll();
  }

  async getTotalDonations(
    startDate?: string,
    endDate?: string,
  ): Promise<number> {
    const donations = await this.execute(startDate, endDate);
    return donations.reduce((sum, donation) => sum + donation.monto, 0);
  }
}
