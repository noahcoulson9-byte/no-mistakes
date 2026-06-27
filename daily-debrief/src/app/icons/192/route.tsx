import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #bfe0ff 0%, #7fb8ff 50%, #ffd1e0 100%)",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: "62%",
            height: "62%",
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.55)",
            border: "4px solid rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 84,
          }}
        >
          ☀️
        </div>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
