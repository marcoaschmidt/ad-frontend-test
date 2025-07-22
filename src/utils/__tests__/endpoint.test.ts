import { allGames, availableFilters, delay } from '../endpoint'

describe('Game Data Utils', () => {
  describe('allGames', () => {
    it('contains games data', () => {
      expect(allGames).toBeInstanceOf(Array)
      expect(allGames.length).toBeGreaterThan(0)
    })

    it('each game has required properties', () => {
      allGames.forEach(game => {
        expect(game).toHaveProperty('id')
        expect(game).toHaveProperty('name')
        expect(game).toHaveProperty('genre')
        expect(game).toHaveProperty('price')
        expect(game).toHaveProperty('image')
        expect(game).toHaveProperty('description')
        expect(game).toHaveProperty('isNew')
        
        expect(typeof game.id).toBe('string')
        expect(typeof game.name).toBe('string')
        expect(typeof game.genre).toBe('string')
        expect(typeof game.price).toBe('number')
        expect(typeof game.image).toBe('string')
        expect(typeof game.description).toBe('string')
        expect(typeof game.isNew).toBe('boolean')
        
        expect(game.price).toBeGreaterThan(0)
        expect(game.id).toBeTruthy()
        expect(game.name).toBeTruthy()
        expect(game.genre).toBeTruthy()
      })
    })

    it('has unique game IDs', () => {
      const ids = allGames.map(game => game.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('contains expected number of games', () => {
      expect(allGames.length).toBe(30)
    })

    it('contains games with various genres', () => {
      const genres = allGames.map(game => game.genre)
      const uniqueGenres = new Set(genres)
      expect(uniqueGenres.size).toBeGreaterThan(1)
    })

    it('contains both new and old games', () => {
      const newGames = allGames.filter(game => game.isNew)
      const oldGames = allGames.filter(game => !game.isNew)
      
      expect(newGames.length).toBeGreaterThan(0)
      expect(oldGames.length).toBeGreaterThan(0)
    })

    it('has games with various price ranges', () => {
      const prices = allGames.map(game => game.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      expect(minPrice).toBeLessThan(maxPrice)
      expect(minPrice).toBeGreaterThan(0)
    })
  })

  describe('availableFilters', () => {
    it('contains unique genres from allGames', () => {
      expect(availableFilters).toBeInstanceOf(Array)
      expect(availableFilters.length).toBeGreaterThan(0)
    })

    it('matches unique genres from allGames', () => {
      const expectedFilters = Array.from(new Set(allGames.map(game => game.genre)))
      expect(availableFilters.sort()).toEqual(expectedFilters.sort())
    })

    it('contains only string values', () => {
      availableFilters.forEach(filter => {
        expect(typeof filter).toBe('string')
        expect(filter).toBeTruthy()
      })
    })

    it('has no duplicate filters', () => {
      const uniqueFilters = new Set(availableFilters)
      expect(uniqueFilters.size).toBe(availableFilters.length)
    })
  })

  describe('delay utility function', () => {
    it('returns a promise', () => {
      const result = delay(100)
      expect(result).toBeInstanceOf(Promise)
    })

    it('resolves after specified time', async () => {
      const start = Date.now()
      await delay(100)
      const end = Date.now()
      
      // Allow some tolerance for timing
      expect(end - start).toBeGreaterThanOrEqual(90)
      expect(end - start).toBeLessThan(200)
    })

    it('resolves with undefined', async () => {
      const result = await delay(1)
      expect(result).toBeUndefined()
    })

    it('works with zero delay', async () => {
      const start = Date.now()
      await delay(0)
      const end = Date.now()
      
      expect(end - start).toBeLessThan(50)
    })

    it('works with different delay values', async () => {
      const delays = [1, 10, 50]
      
      for (const ms of delays) {
        const start = Date.now()
        await delay(ms)
        const end = Date.now()
        
        expect(end - start).toBeGreaterThanOrEqual(ms - 10)
        expect(end - start).toBeLessThan(ms + 50)
      }
    })
  })
})