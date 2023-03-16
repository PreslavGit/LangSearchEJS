const pool = require('./pool')

type lang = {
    id: number,
    langName: string,
    icon: string,
    popularity: number,
    performance: number 
}


export async function getLangData(): Promise<lang[]> {
    let data: lang[] = []
    try{
        [data] = await pool.query("SELECT * FROM langs")
    }catch(err){
        console.log(err);
    }
    return data;
}

export async function getLangID(lang: String): Promise<number>{
    let id
    try {
        [id] = await pool.query("SELECT id FROM langs WHERE lang=? LIMIT 1", [lang])
    } catch (err) {
        console.log(err);
    }
    return id[0].id;
}

export async function getLangParadigms(lang: string): Promise<String[]>{
    let data = []
    let paradigms = []
    try{
        let id = await getLangID(lang)
        data = await pool.query("SELECT p.paradigm, l.lang FROM langparadigms lp INNER JOIN langs l ON l.id = lp.langID INNER JOIN paradigms p ON p.id = lp.paradigmID WHERE l.id = ?", [id]) 
    }catch(err){
        console.log(err);
    }
    paradigms = data[0]
    return paradigms.map((d: any) => d.paradigm)
}