import { Request, Response } from "express";
import { insertLang, insertParadigm, connectParadigm, insertKeyword, connectKeyword } from "../db/queries";
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

    popularity = Number.parseInt(popularity);
    performance = Number.parseInt(performance);
    keywords = keywords.split(",").map((word: string) => word.replace(' ', ''));
    paradigms = paradigms.split(",").map((word: string) => word.replace(' ', ''));
    console.log(paradigms);

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