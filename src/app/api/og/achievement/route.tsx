import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const type = searchParams.get("type") || "badge"; // badge | streak | leaderboard
  const title = searchParams.get("title") || "Achievement Unlocked!";
  const subtitle = searchParams.get("subtitle") || "";
  const value = searchParams.get("value") || "";
  const username = searchParams.get("username") || "A Bowel Buddy";
  const icon = searchParams.get("icon") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF5EB 0%, #FDFBF7 50%, #FFF5EB 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(192, 86, 33, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(192, 86, 33, 0.06)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, #C05621, #ED8936, #C05621)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "40px",
          }}
        >
          {/* Achievement type label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: type === "streak"
                ? "linear-gradient(135deg, #C05621, #ED8936)"
                : type === "leaderboard"
                  ? "linear-gradient(135deg, #D97706, #F59E0B)"
                  : "linear-gradient(135deg, #8B4513, #A0522D)",
              color: "white",
              padding: "8px 24px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {type === "badge" && "Badge Earned"}
            {type === "streak" && "Streak Milestone"}
            {type === "leaderboard" && "Leaderboard"}
          </div>

          {/* Icon / Value display */}
          {value && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: type === "streak"
                  ? "linear-gradient(135deg, #C05621, #ED8936)"
                  : type === "leaderboard"
                    ? "linear-gradient(135deg, #D97706, #F59E0B)"
                    : "linear-gradient(135deg, #8B4513, #A0522D)",
                color: "white",
                fontSize: icon ? "64px" : "48px",
                fontWeight: 800,
                boxShadow: "0 8px 32px rgba(192, 86, 33, 0.3)",
              }}
            >
              {icon || value}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "#1A1A1A",
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: "24px",
                color: "#6B7280",
                textAlign: "center",
                maxWidth: "700px",
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Username */}
          <div
            style={{
              fontSize: "20px",
              color: "#C05621",
              fontWeight: 600,
              marginTop: "8px",
              display: "flex",
            }}
          >
            @{username}
          </div>
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#9CA3AF",
            fontSize: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>💩</span>
            <span style={{ fontWeight: 700, color: "#C05621" }}>
              bowelbuddies.app
            </span>
            <span style={{ color: "#D1D5DB" }}>|</span>
            <span>Track your gut health with friends</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
