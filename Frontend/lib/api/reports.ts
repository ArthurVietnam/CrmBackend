import { apiClient } from "./client"

export const reportsApi = {
  async downloadMonthlyReport(month: number, year: number): Promise<Blob> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/Reports/monthly?month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiClient.getAccessToken()}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to download report")
    }

    return response.blob()
  },
}
