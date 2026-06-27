import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            fontSize: 80,
          }}
        >
          ☀️
        </div>
      </div>
    ),
    size,
  );
}
