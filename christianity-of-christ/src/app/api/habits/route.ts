import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { HabitEntry } from "@/lib/types";

export async function GET() {
  const user = await getCurrentUser();
  const adapter = getAdapter();
  const habits = await adapter.listHabitEntries(user.id);
  return NextResponse.json({ habits });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  const entry = (await request.json()) as HabitEntry;
  const adapter = getAdapter();
  await adapter.addHabitEntry(user.id, entry);
  return NextResponse.json({ ok: true }, { status: 201 });
}
