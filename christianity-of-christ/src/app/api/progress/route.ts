import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { UserProgress } from "@/lib/types";

export async function GET() {
  const adapter = getAdapter();
  const user = await getCurrentUser();
  const progress = await adapter.getProgress(user.id);
  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as UserProgress;
  const adapter = getAdapter();
  const saved = await adapter.upsertProgress(payload);
  return NextResponse.json({ progress: saved }, { status: 201 });
}
