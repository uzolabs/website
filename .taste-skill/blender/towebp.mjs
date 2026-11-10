// Converts the Blender renders in ./out to sized webp files under public/img/3d.
// Icon and page-art pieces are trimmed to their visible pixels and scaled to the same
// optical size (equal area, capped by the longest side), so they read as one set.
import sharp from "sharp"
import { readdirSync } from "node:fs"
import { join } from "node:path"

const src = new URL("./out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
const dest = join(src, "..", "..", "..", "public", "img", "3d")
const sizes = { hero: [1200, 1050], ribbon: [2000, 900] }
const CANVAS = 640
const TARGET = 480 // geometric mean of the trimmed piece, in px
const MAX_SIDE = 540 // about 85% of the canvas

const webp = { quality: 86, alphaQuality: 90 }

for (const file of readdirSync(src).filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "")
  const out = join(dest, `${name}.webp`)
  if (sizes[name]) {
    const [w, h] = sizes[name]
    await sharp(join(src, file)).resize(w, h, { fit: "cover" }).webp(webp).toFile(out)
    console.log("wrote", name)
    continue
  }
  const { data, info } = await sharp(join(src, file)).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true })
  let k = TARGET / Math.sqrt(info.width * info.height)
  k = Math.min(k, MAX_SIDE / Math.max(info.width, info.height))
  const w = Math.round(info.width * k)
  const h = Math.round(info.height * k)
  const piece = await sharp(data).resize(w, h).toBuffer()
  await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: piece, left: Math.round((CANVAS - w) / 2), top: Math.round((CANVAS - h) / 2) }])
    .webp(webp)
    .toFile(out)
  console.log("wrote", name, `${info.width}x${info.height} -> ${w}x${h}`)
}
