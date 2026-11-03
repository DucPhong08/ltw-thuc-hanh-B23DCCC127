import { ImageResponse } from "next/og";
import { getDeadlineById } from "@/lib/data";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  const title = deadline?.title || "Class Deadline Hub";
  const subjectName = deadline?.subjectName || "PTIT Course";
  const dueDate = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString("vi-VN")
    : "Sớm nhất";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0f172a",
        padding: "60px 80px",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          DH
        </div>
        <span style={{ fontSize: "24px", color: "#94a3b8", fontWeight: 600 }}>
          Class Deadline Hub — PTIT
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#818cf8",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {subjectName}
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#f8fafc",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "2px solid #334155",
          paddingTop: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", color: "#94a3b8" }}>Hạn chót:</span>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#f43f5e" }}>
            {dueDate}
          </span>
        </div>
        <span style={{ fontSize: "18px", color: "#64748b" }}>
          ptit.edu.vn • Cổng thông tin deadline
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
