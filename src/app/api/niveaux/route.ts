import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET() {
  const niveau = await db.niveau.findMany();
  return NextResponse.json({ niveau });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description } = body;
  const niveau = await db.niveau.create({
    data: {
      nom,
      description,
    },
  });
  return NextResponse.json({ niveau });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const niveau = await db.niveau.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ niveau });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, description } = body;
  const niveau = await db.niveau.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      description: description,
    },
  });
  return NextResponse.json({ niveau });
}
