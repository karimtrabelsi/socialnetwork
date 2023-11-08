import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const niveau = await db.niveau.findMany();
  return NextResponse.json({ niveau });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, anneeScolaire, nbrClasses } = body;
  const niveau = await db.niveau.create({
    data: {
      nom,
      anneeScolaire,
      nbrClasses,
      classes: {
        createMany: {
          data: Array.from({ length: nbrClasses }, (_, i) => ({
            nom: `${nom}${i + 1}`,
          })),
        },
      },
    },
    include: { classes: true },
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
  const { id, nom, anneeScolaire, nbrClasses } = body;
  const niveau = await db.niveau.update({
    where: {
      id: id,
    },
    data: {
      nom: nom,
      anneeScolaire: anneeScolaire,
      nbrClasses: nbrClasses,
    },
  });
  return NextResponse.json({ niveau });
}
