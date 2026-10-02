import { ImageResponse } from "next/og";

export const alt = "Toprak Tarım";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 82px",
          color: "#f5f1e8",
          background: "linear-gradient(135deg, #102f24 0%, #1d6847 62%, #173f31 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#f07d00" }} />
          <span style={{ fontSize: 22, letterSpacing: "0.24em", textTransform: "uppercase" }}>
            Toprak Tarım
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.03, letterSpacing: "-0.045em" }}>
            Tarım • Agriculture
          </div>
          <div style={{ maxWidth: 760, fontSize: 28, lineHeight: 1.35, color: "rgba(245,241,232,0.72)" }}>
            Üretim • Production • Güvenilir Tedarik
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "rgba(245,241,232,0.55)" }}>
          <span>Kurumsal tarım çözümleri</span>
          <span>2001</span>
        </div>
      </div>
    ),
    size,
  );
}
