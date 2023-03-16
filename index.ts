import { Request, Response } from "express";
import {getLangData} from './db/queries'
import dotenv from 'dotenv';
dotenv.config();

const express = require('express')
const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', async (req: Request, res: Response) => {
    let langsData = await getLangData()
    res.render('./pages/home', {langs: langsData})
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})