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

app.get('/', async (req: Request, res: Response) => {
    let langsData = await getLangData()   
    res.render('./pages/home', {langs: langsData})
})

app.use('/add', addRouter)

app.get('/:lang', async (req: Request, res: Response) => {
    let data = await getFullLangData(req.params.lang)
    
    res.send(data)
})


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})