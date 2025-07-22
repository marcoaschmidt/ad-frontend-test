import { GameService } from '../gameService'
import type { ApiResponse } from '@/types/game'

global.fetch = jest.fn()

const mockApiResponse: ApiResponse = {
  games: [
    {
      id: '1',
      name: 'Test Game',
      genre: 'Action',
      price: 59.99,
      image: '/test-image.jpg',
      description: 'A test game',
      isNew: true,
    }
  ],
  availableFilters: ['Action', 'RPG'],
  totalPages: 1,
  currentPage: 1,
}

describe('GameService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = ""
  })

  describe('getGames', () => {
    it('fetches games successfully with default parameters', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      const result = await GameService.getGames()

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1')
      expect(result).toEqual(mockApiResponse)
    })

    it('fetches games with genre filter', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      const result = await GameService.getGames('Action', 2)

      expect(mockFetch).toHaveBeenCalledWith('/api/games?genre=Action&page=2')
      expect(result).toEqual(mockApiResponse)
    })

    it('ignores "All" genre filter', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      await GameService.getGames('All', 1)

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1')
    })

    it('uses API_BASE_URL when provided', async () => {
      jest.resetModules()
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
      
      const { GameService: GameServiceWithEnv } = await import('../gameService')
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      await GameServiceWithEnv.getGames()

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/api/games?page=1')
    })

    it('throws error when fetch fails', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(GameService.getGames()).rejects.toThrow('Failed to fetch games')
    })

    it('throws error when fetch rejects', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(GameService.getGames()).rejects.toThrow('Network error')
    })

    it('handles empty genre parameter', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      await GameService.getGames('', 1)

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=1')
    })

    it('handles undefined genre parameter', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response)

      await GameService.getGames(undefined, 3)

      expect(mockFetch).toHaveBeenCalledWith('/api/games?page=3')
    })
  })
})