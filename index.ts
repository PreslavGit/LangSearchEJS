import { Request, Response } from "express";
import {getLangData, getLangParadigms, getFullLangData} from './db/queries'
import dotenv from 'dotenv';
dotenv.config();

const addRouter = require('./controllers/AddLang')

const express = require('express')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.set('view engine', 'ejs')


app.use('/add', addRouter)

app.get('/langs/:lang', async (req: Request, res: Response) => {
    let data = await getFullLangData(req.params.lang)
    if(typeof data == typeof ""){
        res.send("Language not found")
    }else{
        res.render('./pages/lang', {data: data[0]})
    }
})

app.get('/', async (req: Request, res: Response) => {
    let query = req.query;

    if(Object.keys(query).length === 0){
        let langsData = await getLangData()   
        res.render('./pages/home', {langs: langsData})
    }else{
        res.send(query);
    }

})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})