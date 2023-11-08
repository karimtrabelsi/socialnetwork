import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const up = await db.up.findMany();
  return NextResponse.json({ up });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, description, departement } = body;
  console.log("dep", departement);
  const up = await db.up.create({
    data: {
      nom,
      description,
      depart: {
        connect: {
          id: departement,
        },
      },
    },
  });
  return NextResponse.json({ up });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const up = await db.up.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ up });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, description } = body;
  const up = await db.up.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      description: description,
    },
  });
  return NextResponse.json({ up });
}
