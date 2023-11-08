import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const modules = await db.module.findMany({
    where: {
      enseignants: {
        some: {
          id: userId as string,
        },
      },
    },
  });

  return Response.json({ modules });
}
