export interface Game {
  id: string
  genre: string
  image: string
  name: string
  description?: string
  price: number
  isNew: boolean
}

export interface ApiResponse {
  games: Game[]
  availableFilters: string[]
  totalPages: number
  currentPage: number
}

export interface CartItem extends Game {
  quantity: number
}
