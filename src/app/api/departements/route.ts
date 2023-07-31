import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const departement = await db.departement.findMany();
  return NextResponse.json({ departement });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description } = body;
  const departement = await db.departement.create({
    data: {
      nom,
      description,
    },
  });
  return NextResponse.json({ departement });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const departement = await db.departement.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ departement });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, description } = body;
  const departement = await db.departement.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      description: description,
    },
  });
  return NextResponse.json({ departement });
}
