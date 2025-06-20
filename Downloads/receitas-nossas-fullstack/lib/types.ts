export interface User {
  _id: string
  name: string
  email: string
  password: string
  role: "user" | "admin"
  favorites: string[]
  createdAt: Date
}

export interface Recipe {
  _id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  images: string[]
  category: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: "Fácil" | "Médio" | "Difícil"
  author: string
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
