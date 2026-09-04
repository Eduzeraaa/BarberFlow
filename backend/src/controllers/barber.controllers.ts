import type { Request, Response } from 'express'
import { barbers } from "../config/database.js"

export async function allTheBarbers(request: Request, response: Response) {

    const BARBEIROS = await barbers.find().toArray()

    return response.status(200).json(BARBEIROS)

}