import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const option = await db.option.findMany();
  return NextResponse.json({ option });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description, departement } = body;
  console.log("dep", departement);
  const option = await db.option.create({
    data: {
      nom,
      description,
      dept: {
        connect: {
          id: departement,
        },
      },
    },
  });
  return NextResponse.json({ option });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const option = await db.option.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ option });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, description } = body;
  const option = await db.option.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      description: description,
    },
  });
  return NextResponse.json({ option });
}
