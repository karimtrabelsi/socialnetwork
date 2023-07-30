import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const niveau = await prisma.niveau.findMany();
  return NextResponse.json({ niveau });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description } = body;
  const niveau = await prisma.niveau.create({
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
  const niveau = await prisma.niveau.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ niveau });
}
