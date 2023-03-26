const pool = require('./pool')
import { getLangID } from "./langQueries"

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
