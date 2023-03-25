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
    console.log(`Insert ${data.keywords} into keywords `);

}

export async function getParadigmID(paradigm: String): Promise<number | null> {
    let id
    try {
        [id] = await pool.query("SELECT id FROM paradigms WHERE paradigm=? LIMIT 1", [paradigm])
        if (id.length === 0) { throw "No paradigm found" }
    } catch (err) {
        console.log(err);
        return null;
    }
    return id[0].id;
}

export async function insertParadigm(paradigm: string) {
    try {
        if (await getParadigmID(paradigm) !== null) { throw "Paradigm already in database" }
        await pool.query("INSERT INTO paradigms (paradigm) VALUES (?) ", [paradigm])
        console.log(`${paradigm} inserted into paradigms`);
    } catch (error) {
        console.log(error);
    }

}

export async function connectParadigm(lang: string, paradigm: string) {
    try {
        let langID = await getLangID(lang);
        let paradigmID = await getParadigmID(paradigm);
        await pool.query("INSERT INTO langparadigms (langID, paradigmID) VALUES (?, ?)", [langID, paradigmID])
    } catch (err) {
        console.log(err);
    }
}

export async function getKeywordID(keyword: String): Promise<number | null> {
    let id
    try {
        [id] = await pool.query("SELECT id FROM tags WHERE tag=? LIMIT 1", [keyword])
        if (id.length === 0) { throw "No keyword found" }
    } catch (err) {
        console.log(err);
        return null;
    }
    return id[0].id;
}

export async function insertKeyword(keyword: string) {
    try {
        if (await getKeywordID(keyword) !== null) { throw "Keyword already in database" }
        await pool.query("INSERT INTO tags (tag) VALUES (?) ", [keyword])
        console.log(`${keyword} inserted into keywords`);
    } catch (error) {
        console.log(error);
    }

}

export async function connectKeyword(lang: string, keyword: string) {
    try {
        let langID = await getLangID(lang);
        let tagID = await getKeywordID(keyword);
        await pool.query("INSERT INTO langtags (langID, tagID) VALUES (?, ?)", [langID, tagID])
    } catch (err) {
        console.log(err);
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

    return data;
}

export type langFilter = {
    lang: string
    popularity: number
    performance: number
    paradigms: string[]
    keywords: string[]
}
export async function getFilteredLangs(filter: langFilter){
    let [query, values] = queryBuilder(filter); 
    let data;
    try{
        [data] = await pool.query(query, values); 
    }catch(err){
        console.log(err);
    }

    return data;
}

function queryBuilder(filter: langFilter){
    let query = "SELECT * FROM langs l ";
    let values: any = ["%" + filter.lang + "%"]

    let paraStr = filter.paradigms.join("|")
    let keywordStr = filter.keywords.join("|")

    if(filter.paradigms[0] !== ''){
        query += "LEFT JOIN langparadigms lp ON l.id = lp.langID LEFT JOIN paradigms p ON lp.paradigmID = p.id "
    }

    if(filter.keywords[0] !== ''){
        query += "LEFT JOIN langtags lt ON l.id = lt.langID LEFT JOIN tags t ON lt.tagID = t.id "
    }

    query += "WHERE lang LIKE ? ";

    if(filter.popularity != 0){
        query += "AND popularity = ? "
        values.push(filter.popularity)
    }
    if(filter.performance != 0){
        query += "AND performance = ? "
        values.push(filter.performance)
    }

    if(filter.paradigms[0] !== ''){
        query += "AND paradigm regexp ? "
        values.push(paraStr)
    }

    if(filter.keywords[0] !== ''){
        query += "AND tag regexp ? "
        values.push(keywordStr)
    } 

    query += "GROUP BY l.lang"
    
    return [query, values];
}





