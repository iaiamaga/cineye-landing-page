import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const client = await clientPromise
    const db = client.db("receitas-nossas")

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      favorites: [],
      createdAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString(), "user")

    return NextResponse.json({
      token,
      user: {
        _id: result.insertedId,
        name,
        email,
        role: "user",
        favorites: [],
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
