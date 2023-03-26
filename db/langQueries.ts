const pool = require('./pool')
import { LangData } from "../controllers/AddLang"

type lang = {
    id: number,
    langName: string,
    icon: string,
    popularity: number,
    performance: number
}


export async function getLangData(): Promise<lang[]> {
    let data: lang[] = []
    try {
        [data] = await pool.query("SELECT * FROM langs")
    } catch (err) {
        console.log(err);
    }
    return data;
}

export async function getLangID(lang: String): Promise<number | null> {
    let id
    try {
        [id] = await pool.query("SELECT id FROM langs WHERE lang=? LIMIT 1", [lang])
        if (id.length === 0) { throw "No language found" }
    } catch (err) {
        console.log(err);
        return null;
    }
    return id[0].id;
}

export async function getLangParadigms(lang: string): Promise<String[] | null> {
    let data = []
    let paradigms = []
    try {
        let id = await getLangID(lang)
        if (id === null) { throw "No language found" }
        data = await pool.query("SELECT p.paradigm, l.lang FROM langparadigms lp INNER JOIN langs l ON l.id = lp.langID INNER JOIN paradigms p ON p.id = lp.paradigmID WHERE l.id = ?", [id])
    } catch (err) {
        console.log(err);
        return null;
    }
    paradigms = data[0]
    return paradigms.map((d: any) => d.paradigm)
}

export async function insertLang(data: LangData) {
    try {
        if (await getLangID(data.name) !== null) { throw "Language already in database" }
        await pool.query("INSERT INTO langs (lang, icon, popularity, performance) VALUES (?, ?, ?, ?) ", [data.name, data.icon, data.popularity, data.performance])
        console.log(`${data.name} inserted into langs`);
    } catch (error) {
        console.log(error);
    }
}




