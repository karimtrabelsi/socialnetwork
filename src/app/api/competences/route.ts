import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const comps = await db.competence.findMany({
    where: {
      module: {
        enseignants: {
          some: {
            id: userId as string,
          },
        },
      },
    },
    include: {
      module: true,
    },
  });
  return NextResponse.json({ comps });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const body = await req.json();
  const { nom, description, module } = body;
  const comp = await db.competence.create({
    data: {
      nom,
      description,
      module: {
        connect: {
          id: module,
        },
      },
      enseignants: {
        connect: {
          id: userId as string,
        },
      },
    },
  });
  return NextResponse.json({ comp });
}
