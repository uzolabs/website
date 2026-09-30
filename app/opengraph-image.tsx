import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { arc, spiral, tail } from "@/lib/uli"

export const alt = "Uzo Labs: The developer path for BOT Chain"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const s = spiral({ cx: 900, cy: 300, r0: 4, gap: 30, turns: 5, start: Math.PI / 2 })
const road = tail(s.end, s.tangent, 120, { x: 760, y: 640 }, { x: 560, y: 660 })

export default async function Image() {
  const [reggae, satoshi] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/ReggaeOne-Regular.ttf")),
    readFile(join(process.cwd(), "assets/og/Satoshi-Medium.otf")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0B0A09",
          backgroundImage:
            "radial-gradient(circle at 78% 40%, rgba(217,164,65,0.22), transparent 55%), radial-gradient(circle at 10% 100%, rgba(178,58,42,0.18), transparent 50%)",
          color: "#F5F1EA",
          fontFamily: "Satoshi",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <path d={s.d} fill="none" stroke="#D9A441" strokeOpacity={0.75} strokeWidth={2} strokeLinecap="round" />
          <path d={road} fill="none" stroke="#D9A441" strokeOpacity={0.75} strokeWidth={2} strokeLinecap="round" />
          <path d={arc(900, 300, 200, 200, 320)} fill="none" stroke="#F5F1EA" strokeOpacity={0.18} strokeWidth={1.5} />
          <path d={arc(900, 300, 222, 20, 110)} fill="none" stroke="#B23A2A" strokeOpacity={0.6} strokeWidth={1.5} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 720 }}>
          <div style={{ fontFamily: "Reggae One", fontSize: 168, lineHeight: 1, color: "#F5F1EA" }}>Uzo</div>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", fontSize: 40, lineHeight: 1.25 }}>
            <span style={{ color: "#A8A095" }}>BOT Chain has the pieces.</span>
            <span style={{ color: "#F5F1EA" }}>Uzo is the path.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#D9A441" }}>uzolabs.xyz</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Reggae One", data: reggae, weight: 400, style: "normal" },
        { name: "Satoshi", data: satoshi, weight: 500, style: "normal" },
      ],
    }
  )
}
