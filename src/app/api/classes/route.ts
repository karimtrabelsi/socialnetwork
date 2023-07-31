import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const classe = await db.classe.findMany();
  return NextResponse.json({ classe });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description } = body;
  const classe = await db.classe.create({
    data: {
      nom,
      description,
    },
  });
  return NextResponse.json({ classe });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const classe = await db.classe.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ classe });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, description } = body;
  const classe = await db.classe.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      description: description,
    },
  });
  return NextResponse.json({ classe });
}
