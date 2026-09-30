import { Cta } from "@/components/sections/cta"
import { Hero } from "@/components/sections/hero"
import { NetworkSection } from "@/components/sections/network"
import { Principles } from "@/components/sections/principles"
import { Problem } from "@/components/sections/problem"
import { Products } from "@/components/sections/products"
import { Quickstart } from "@/components/sections/quickstart"
import { Roadmap } from "@/components/sections/roadmap"
import { UliZigzag } from "@/components/uli/zigzag"

export default function Home() {
  return (
    <>
      <Hero />
      <UliZigzag />
      <Problem />
      <Products />
      <UliZigzag />
      <NetworkSection />
      <Quickstart />
      <UliZigzag />
      <Roadmap />
      <Principles />
      <UliZigzag />
      <Cta />
    </>
  )
}
