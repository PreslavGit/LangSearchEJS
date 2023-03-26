const pool = require('./pool')
import { getLangID } from "./langQueries"

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
