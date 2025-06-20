"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { Recipe } from "@/lib/types"
import Header from "@/components/Header"
import RecipeCard from "@/components/RecipeCard"
import AuthForm from "@/components/AuthForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChefHat } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)

  const categories = [
    "all",
    "Café da Manhã",
    "Almoço",
    "Jantar",
    "Sobremesas",
    "Lanches",
    "Bebidas",
    "Vegetariano",
    "Vegano",
  ]

  useEffect(() => {
    fetchRecipes()
  }, [selectedCategory, searchTerm])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchRecipes = async () => {
    try {
      setIsLoadingRecipes(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/recipes?${params}`)
      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const fetchFavorites = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  const handleToggleFavorite = (recipeId: string) => {
    const recipe = recipes.find((r) => r._id === recipeId)
    if (!recipe) return

    const isFavorited = favorites.some((f) => f._id === recipeId)

    if (isFavorited) {
      setFavorites(favorites.filter((f) => f._id !== recipeId))
    } else {
      setFavorites([...favorites, recipe])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Receitas Nossas</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Descubra sabores únicos e compartilhe momentos especiais com receitas que aquecem o coração
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explorar Receitas
          </Button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "Todas" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section id="recipes" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {searchTerm
              ? `Resultados para "${searchTerm}"`
              : selectedCategory === "all"
                ? "Todas as Receitas"
                : selectedCategory}
          </h2>

          {isLoadingRecipes ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={favorites.some((f) => f._id === recipe._id)}
                />
              ))}

              {recipes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Nenhuma receita encontrada</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Favorites Section */}
      {user && favorites.length > 0 && (
        <section id="favorites" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Suas Receitas Favoritas</h2>

            <div className="space-y-8">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorited={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Auth Section */}
      {!user && <AuthForm />}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Receitas Nossas - BodhiSabores. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
