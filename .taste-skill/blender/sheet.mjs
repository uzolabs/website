import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"
const dir = process.argv[2]
const files = fs.readdirSync(dir).filter((f) => /.(png|webp)$/.test(f) && f !== "sheet.png" && !/hero|ribbon/.test(f))
const tile = 420
const cols = Math.min(4, files.length)
const rows = Math.ceil(files.length / cols)
const comps = await Promise.all(files.map(async (f, i) => ({
  input: await sharp(path.join(dir, f)).resize(tile, tile, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
  left: (i % cols) * tile, top: Math.floor(i / cols) * tile,
})))
await sharp({ create: { width: cols * tile, height: rows * tile, channels: 4, background: "#0b0a09" } }).composite(comps).png().toFile(path.join(dir, "..", "sheet.png"))
console.log(files.join(", "))
