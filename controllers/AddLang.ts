import { Request, Response } from "express";
import { insertLang } from "../db/langQueries";
import { connectParadigm, insertParadigm } from "../db/paradigmQueries";
import { insertKeyword, connectKeyword } from "../db/keywordQueries";
import { langFull } from "../types/lang";
const router = require('express').Router()

router.get('/', (req: Request, res: Response) => {
    res.render('./pages/add')
})

router.post('/', async ({ body: { name, icon, popularity, performance, keywords, paradigms } }: any, res: Response) => {

    popularity = parseInt(popularity);
    performance = parseInt(performance);
    keywords = keywords.split(",").map((word: string) => word.trim());
    paradigms = paradigms.split(",").map((word: string) => word.trim());

    const LangData: langFull = { name, icon, popularity, performance, keywords, paradigms };

    await addLang(LangData)

    res.render('./pages/add')
})

async function addLang(langData: langFull){
    await insertLang(langData)

    //add paradigms
    for (const paradigm of langData.paradigms) {
        await insertParadigm(paradigm);
        await connectParadigm(langData.name, paradigm)
    }

    //add keywords
    for (const keyword of langData.keywords) {
        await insertKeyword(keyword);
        await connectKeyword(langData.name, keyword)
    }
}


module.exports = router