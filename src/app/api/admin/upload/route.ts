import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      {
        error:
          "Storage is not configured. Set the Supabase service role key to upload images.",
      },
      { status: 503 },
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WebP, and GIF images are allowed." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB." },
      { status: 413 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `uploads/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Upload failed." },
      { status: 500 },
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
