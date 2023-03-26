const pool = require('./pool')
import { getLangID } from "./langQueries"

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