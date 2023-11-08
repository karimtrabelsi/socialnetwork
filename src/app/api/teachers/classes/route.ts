import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  const classes = await db.classe.findMany({
    where: {
      modules: {
        some: {
          id: moduleId as string,
        },
      },
    },
  });

  return Response.json({ classes });
}
