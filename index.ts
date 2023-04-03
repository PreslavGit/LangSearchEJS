import { Request, Response, urlencoded } from "express";
import { getFilteredLangs } from './db/homeQueries'
import { getLangData, getFullLangData } from "./db/langQueries";
import { langSearch } from "./types/lang";
import dotenv from 'dotenv';
dotenv.config();

const addRouter = require('./controllers/AddLang')

const express = require('express')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.set('view engine', 'ejs')


app.use('/add', addRouter)

app.get('/langs/:lang', async (req: Request, res: Response) => {
    let data = await getFullLangData(req.params.lang)
    if (typeof data == "string") {
        res.send("Language not found")
    } else {
        res.render('./pages/lang', { data: data[0] })
    }
})

app.get('/', async (req: Request, res: Response) => {
    if (Object.keys(req.query).length === 0) {
        let langsData = await getLangData()
        res.render('./pages/home', { langs: langsData })
    } else {
        type searchQuery = {
            name: string
            popularity: string
            performance: string
            paradigms: string
            keywords: string
        }

        let query = req.query as searchQuery;

        let filter: langSearch = {
            name: query.name,
            popularity: parseInt(query.popularity),
            performance: parseInt(query.performance),
            paradigms: query.paradigms.split(",").map((word: string) => word.trim()),
            keywords: query.keywords.split(",").map((word: string) => word.trim())
        }

        let langsData = await getFilteredLangs(filter);
        
        res.render('./pages/home', { langs: langsData });
    }

})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})