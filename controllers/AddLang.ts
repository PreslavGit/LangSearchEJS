import { Request, Response } from "express";

const router = require('express').Router()

router.get('/', (req: Request, res: Response) => {
    res.render('./pages/add')
})

type FormData = {
    name: string
    icon: string
    popularity: number
    performance: number
    keywords: string
    paradigms: string
}

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    data.popularity = Number.parseInt(data.popularity);
    data.performance = Number.parseInt(data.performance);
    data = data as FormData
    console.log(typeof data.performance);
    res.render('./pages/add')
})


module.exports = router