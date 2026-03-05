import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Reflection } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  const adapter = getAdapter();
  const reflections = await adapter.listReflections(user.id);
  return NextResponse.json({ reflections });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  const reflection = (await request.json()) as Reflection;
  const adapter = getAdapter();
  await adapter.addReflection(user.id, reflection);
  return NextResponse.json({ ok: true }, { status: 201 });
}
