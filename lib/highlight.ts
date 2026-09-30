import { createHighlighter, type ThemeRegistrationRaw } from "shiki"

// Syntax theme in the Uli palette. Colours checked for AA contrast on the code panel.
const uliTheme: ThemeRegistrationRaw = {
  name: "uli",
  type: "dark",
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": "#F5F1EA",
  },
  settings: [
    { settings: { foreground: "#F5F1EA", background: "#00000000" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#9A9186", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#D9A441" } },
    { scope: ["string", "string.quoted", "punctuation.definition.string"], settings: { foreground: "#E8A08C" } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#F0C987" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#F2DDB0" } },
    { scope: ["variable.other.property", "meta.object-literal.key", "support.type.property-name"], settings: { foreground: "#D8CFC2" } },
    { scope: ["entity.name.tag", "entity.name.section", "entity.name.table"], settings: { foreground: "#D9A441" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#B5AC9F" } },
    { scope: ["variable.parameter", "variable.other.constant"], settings: { foreground: "#F5F1EA" } },
  ],
}

export type Lang = "ts" | "toml" | "bash"

let highlighter: ReturnType<typeof createHighlighter> | undefined

function getHighlighter() {
  highlighter ??= createHighlighter({ themes: [uliTheme], langs: ["ts", "toml", "bash"] })
  return highlighter
}

export async function highlight(code: string, lang: Lang) {
  const h = await getHighlighter()
  return h.codeToHtml(code, { lang, theme: "uli" })
}
