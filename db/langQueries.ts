const pool = require('./pool')
import { langFull } from "../types/lang"
import { lang }  from "../types/lang"

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

export async function insertLang(data: langFull) {
    try {
        if (await getLangID(data.name) !== null) { throw "Language already in database" }
        await pool.query("INSERT INTO langs (lang, icon, popularity, performance) VALUES (?, ?, ?, ?) ", [data.name, data.icon, data.popularity, data.performance])
        console.log(`${data.name} inserted into langs`);
    } catch (error) {
        console.log(error);
    }
}

export async function getFullLangData(lang: string) {
    let query = `SELECT l.lang, l.popularity, l.performance,  GROUP_CONCAT(DISTINCT p.paradigm ORDER BY p.paradigm SEPARATOR ', ') AS paradigms, GROUP_CONCAT(DISTINCT t.tag ORDER BY t.tag SEPARATOR ', ') AS tags
                FROM langs l
                LEFT JOIN langparadigms lp ON l.id = lp.langID
                LEFT JOIN paradigms p ON lp.paradigmID = p.id
                LEFT JOIN langtags lt ON l.id = lt.langID
                LEFT JOIN tags t ON lt.tagID = t.id
                WHERE l.lang = ?
                GROUP BY l.lang;`
    let data;
    try {
        let id = await getLangID(lang);
        if(id === null){throw "Language not found"}
        [data] = await pool.query(query, [lang])
    } catch (err) {
        console.log(err);
        return "Language not found"
    }

    return data as langFull[];
}




