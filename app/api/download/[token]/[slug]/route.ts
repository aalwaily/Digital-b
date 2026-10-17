import { verifyDownloadToken } from "@/lib/download-token";
import { privatePdfPath } from "@/lib/files";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string; slug: string }> },
) {
  const { token, slug } = await context.params;
  const payload = verifyDownloadToken(token);
  if (!payload) {
    return NextResponse.json({ error: "This download link is invalid or expired." }, { status: 401 });
  }
  if (!payload.files.includes(slug)) {
    return NextResponse.json({ error: "That file is not part of this order." }, { status: 403 });
  }
  const filePath = privatePdfPath(slug);
  if (!filePath) {
    return NextResponse.json({ error: "The file is missing on the server." }, { status: 404 });
  }
  const data = await fs.readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="vellum-${slug}.pdf"`,
      "Content-Length": String(data.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
