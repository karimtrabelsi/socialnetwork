import { db } from "@/lib/db";

export async function GET() {
  const teachers = await db.user.findMany();

  return Response.json({ teachers });
}
