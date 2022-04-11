import { pairServ } from '../services/pairingService';
import { Request, Response } from 'express'

/**
 * pair controller method. routed from '/pairing' 
 * @param {*} req express request
 * @param {*} res express response
 */
export async function pair(req: Request, res: Response) {
    try {
        const body = req.body
        const resp = await pairServ(body)
        res.json(resp)
    } catch (e) {
        res.status(500).json(JSON.stringify(e));
    }
}