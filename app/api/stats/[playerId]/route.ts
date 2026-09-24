import { NextResponse } from "next/server";

// Public endpoint contract for normalized Firestore snapshots. Returns an honest empty state
// until Firebase public configuration and a snapshot store are configured.
export async function GET(_: Request, { params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params;
  return NextResponse.json({ playerId, snapshot: null, status: "pendingVerification", message: "No verified statistics snapshot is available." }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
