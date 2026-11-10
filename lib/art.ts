// The 3D glass art, rendered in Blender from .taste-skill/blender/render.py. All of it is decorative.

export type Art = { src: string; width: number; height: number }

const piece = (name: string, width = 640, height = 640): Art => ({ src: `/img/3d/${name}.webp`, width, height })

export const art = {
  hero: piece("hero", 1200, 1050),
  ribbon: piece("ribbon", 2000, 900),
  deploy: piece("deploy"),
  sdk: piece("sdk"),
  templates: piece("templates"),
  rpc: piece("rpc"),
  index: piece("index"),
  faucet: piece("faucet"),
  quickstart: piece("quickstart"),
  roadmap: piece("roadmap"),
  network: piece("network"),
} as const

export type ArtName = keyof typeof art

/** Each product's piece, by its slug in lib/products.ts. */
export const productArt: Record<string, Art> = {
  deploy: art.deploy,
  sdk: art.sdk,
  templates: art.templates,
  rpc: art.rpc,
  index: art.index,
}
