import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { recipeId } = await request.json()

    const client = await clientPromise
    const db = client.db("receitas-nossas")

    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const isFavorited = user.favorites?.includes(recipeId)

    if (isFavorited) {
      await db.collection("users").updateOne({ _id: new ObjectId(decoded.userId) }, { $pull: { favorites: recipeId } })
    } else {
      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(decoded.userId) }, { $addToSet: { favorites: recipeId } })
    }

    return NextResponse.json({ favorited: !isFavorited })
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
