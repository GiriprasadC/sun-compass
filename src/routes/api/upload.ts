import { createAPIFileRoute } from "@tanstack/react-start/api";

export const Route = createAPIFileRoute("/api/upload")({
  POST: async ({ request }) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${Math.random().toString(36).substring(2, 9)}${ext}`;
      
      const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : ".";
      const uploadDir = path.resolve(cwd, "public/uploads");
      
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.resolve(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      
      return new Response(JSON.stringify({ success: true, url: `/uploads/${filename}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("API Upload failed:", err);
      return new Response(JSON.stringify({ success: false, error: (err as Error).message || String(err) }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
});
