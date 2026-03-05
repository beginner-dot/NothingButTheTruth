import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({
    message: "Admin CMS stub received payload. Connect to RBAC + persistent storage in production.",
    payload,
  });
}
