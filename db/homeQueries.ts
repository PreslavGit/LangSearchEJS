const pool = require('./pool')
import { lang, langFull } from "../types/lang";

export async function getFilteredLangs(filter: langFull){
    let [query, values] = queryBuilder(filter); 
    let data;
    try{
        [data] = await pool.query(query, values);    
    }catch(err){
        console.log(err);
    }

    return data as lang[];
}

function queryBuilder(filter: langFull){
    let query = "SELECT * FROM langs l ";
    let values: any = ["%" + filter.name + "%"]

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
