"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Heart, User, Menu, X } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-orange-600">Receitas Nossas</h1>
            <span className="text-sm text-gray-500 hidden sm:block">BodhiSabores</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" })}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Receitas
            </button>
            {user && (
              <button
                onClick={() => document.getElementById("favorites")?.scrollIntoView({ behavior: "smooth" })}
                className="text-gray-700 hover:text-orange-600 transition-colors flex items-center space-x-1"
              >
                <Heart className="w-4 h-4" />
                <span>Favoritos</span>
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden sm:block">Olá, {user.name}</span>
                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("login")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <User className="w-4 h-4 mr-1" />
                  Entrar
                </Button>
              </div>
            )}

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-left text-gray-700 hover:text-orange-600 py-2"
              >
                Início
              </button>
              <button
                onClick={() => {
                  document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
                className="text-left text-gray-700 hover:text-orange-600 py-2"
              >
                Receitas
              </button>
              {user && (
                <button
                  onClick={() => {
                    document.getElementById("favorites")?.scrollIntoView({ behavior: "smooth" })
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-gray-700 hover:text-orange-600 py-2"
                >
                  Favoritos
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
