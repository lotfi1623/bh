import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe d'administration n'est pas configuré sur le serveur." },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
