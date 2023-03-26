import { Request, Response } from "express";
import { insertLang } from "../db/langQueries";
import { connectParadigm, insertParadigm } from "../db/paradigmQueries";
import { insertKeyword, connectKeyword } from "../db/keywordQueries";
const router = require('express').Router()

router.get('/', (req: Request, res: Response) => {
    res.render('./pages/add')
})

export type LangData = {
    name: string
    icon: string
    popularity: number
    performance: number
    keywords: string[]
    paradigms: string[]
}

router.post('/', async ({ body: { name, icon, popularity, performance, keywords, paradigms } }: any, res: Response) => {

    popularity = parseInt(popularity);
    performance = parseInt(performance);
    keywords = keywords.split(",").map((word: string) => word.trim());
    paradigms = paradigms.split(",").map((word: string) => word.trim());

    const LangData: LangData = { name, icon, popularity, performance, keywords, paradigms };

    await insertLang(LangData)

    //add paradigms
    for (const paradigm of LangData.paradigms) {
        await insertParadigm(paradigm);
        await connectParadigm(name, paradigm)
    }

    //add keywords
    for (const keyword of LangData.keywords) {
        await insertKeyword(keyword);
        await connectKeyword(name, keyword)
    }

    res.render('./pages/add')
})


module.exports = router