import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const ups = await db.up.findMany({
    where: {
      enseignants: {
        some: {
          id: userId as string,
        },
      },
    },
  });

  return Response.json({ ups });
}
