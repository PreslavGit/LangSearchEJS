import { Request, Response } from "express";
import {getLangData, getLangParadigms} from './db/queries'
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
    // console.log(langsData);
    // let paradims = await getLangParadigms("Typescript")
    // console.log(paradims);
    
    res.render('./pages/home', {langs: langsData})
})

app.use('/add', addRouter)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})