import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const client = await clientPromise
    const db = client.db("receitas-nossas")

    const user = await db.collection("users").findOne({ email })

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const token = generateToken(user._id.toString(), user.role)

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
