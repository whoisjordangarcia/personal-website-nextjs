import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Jordan Garcia — Senior Software Engineer specializing in TypeScript, Python, and distributed systems";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0f1117",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        padding: 60,
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#1e2030",
          borderRadius: 24,
          border: "4px solid #4b4f6b",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            background: "#181a24",
            borderBottom: "2px solid #4b4f6b",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#febc2e",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#28c840",
            }}
          />
          <div
            style={{
              color: "#6b7280",
              fontSize: 20,
              marginLeft: 16,
            }}
          >
            ~/jordangarcia.dev
          </div>
        </div>

        {/* Terminal content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 40,
            gap: 24,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Command line 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#22c55e", fontSize: 32 }}>{">"}</span>
            <span style={{ color: "#a5adcb", fontSize: 32 }}>whoami</span>
          </div>

          {/* Output - Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#ffffff",
              marginLeft: 48,
            }}
          >
            Jordan Garcia
          </div>

          {/* Command line 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 32 }}>{">"}</span>
            <span style={{ color: "#a5adcb", fontSize: 32 }}>cat role.txt</span>
          </div>

          {/* Output - Role */}
          <div
            style={{
              fontSize: 36,
              color: "#a5adcb",
              marginLeft: 48,
            }}
          >
            Senior Software Engineer
          </div>

          {/* Blinking cursor line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 32 }}>{">"}</span>
            <span
              style={{
                width: 20,
                height: 36,
                background: "#a5adcb",
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
