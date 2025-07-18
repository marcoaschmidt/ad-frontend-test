import { ApiResponse } from "@/types/game"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class GameService {
  static async getGames(genre?: string, page = 1): Promise<ApiResponse> {
    const params = new URLSearchParams()
    if (genre && genre !== "All") {
      params.append("genre", genre)
    }
    params.append("page", page.toString())

    const url = `${API_BASE_URL}/api/games?${params.toString()}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch games")
    }

    return response.json()
  }
}
