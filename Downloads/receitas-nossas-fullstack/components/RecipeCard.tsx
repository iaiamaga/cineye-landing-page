"use client"

import { useState } from "react"
import Image from "next/image"
import type { Recipe } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Clock, Users, ChefHat } from "lucide-react"

interface RecipeCardProps {
  recipe: Recipe
  onToggleFavorite?: (recipeId: string) => void
  isFavorited?: boolean
}

export default function RecipeCard({ recipe, onToggleFavorite, isFavorited }: RecipeCardProps) {
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleToggleFavorite = async () => {
    if (!user || !onToggleFavorite) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId: recipe._id }),
      })

      if (response.ok) {
        onToggleFavorite(recipe._id)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {recipe.images && recipe.images.length > 0 && (
          <div className="relative h-64 bg-gray-200">
            <Image
              src={recipe.images[currentImageIndex] || "/placeholder.svg?height=256&width=400"}
              alt={recipe.title}
              fill
              className="object-cover"
              loading="lazy"
            />

            {recipe.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {recipe.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              recipe.difficulty === "Fácil"
                ? "bg-green-100 text-green-800"
                : recipe.difficulty === "Médio"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} porções</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChefHat className="w-4 h-4" />
              <span>{recipe.category}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => {
            // Aqui você pode implementar a navegação para a receita completa
            console.log("Ver receita completa:", recipe._id)
          }}
        >
          Ver Receita Completa
        </Button>
      </CardContent>
    </Card>
  )
}
