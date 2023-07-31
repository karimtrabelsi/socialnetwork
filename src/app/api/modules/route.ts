import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const modules = await db.module.findMany();
  return NextResponse.json({ modules });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, semestre, periode, chargeHoraire, credits } = body;
  const modules = await db.module.create({
    data: {
      nom,
      semestre,
      periode,
      chargeHoraire,
      credits,
    },
  });
  return NextResponse.json({ modules });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const modules = await db.module.delete({
    where: {
      id: id,
    },
  });
  return NextResponse.json({ modules });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nom, semestre, periode, chargeHoraire, credits } = body;
  const modules = await db.module.update({
    where: {
      id: id,
    },
    data: {
      nom,
      semestre,
      periode,
      chargeHoraire,
      credits,
    },
  });
  return NextResponse.json({ modules });
}
