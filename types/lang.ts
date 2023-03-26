export type lang = {
    name: string
    icon: string
    popularity: number
    performance: number
}

export type langFull = lang & {
    icon: string
    keywords: string[]
    paradigms: string[]
}