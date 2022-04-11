import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import request from 'request-promise';
import * as path from 'path';
import { IPayload, IRequestInput, IResponse, IResult } from './models';
import { TransactionType } from './constants';

var keys;

/**
 * Read the public and private key files for the jwt token. Cache them
 */
function readkeys() {
    try {
        if (!keys) {
            var privateKey  = fs.readFileSync(path.join(__dirname, './private.key'), 'utf8');
            var publicKey  = fs.readFileSync(path.join(__dirname, './public.key'), 'utf8');
            keys = {
                privateKey,
                publicKey,
            }
        }
        return keys
    } catch (e) {
        throw new Error('failed to read keys')
    }
}

/**
 * Pair the financial request. Service method
 * @param body 
 */
export async function pairServ(body: IRequestInput[]) {
    try {
        if (!body || body.length === 0) {
            return;
        }
        
        let result = []
        for (let input of body) {
            const payload = transformPayload(input)
            const response = await send(input.FL_ACCOUNT, payload)
            result.push(response);
        }
        return result
    } catch (e) {
        throw new Error('failed to pairServ')
    }

}

/**
 * send the signed value to an endpoint
 * @param accountId 
 * @param payload 
 */
async function send(accountId: string, payload: any) {
    try {
        // sign the payload with the private key.
        const token = jwt.sign(payload, readkeys().privateKey)
        const result = await request.post(`endpoint.dev/api/${accountId}?signature=${token}`, { json: true, body: payload });
        const response = result.body;
        jwt.verify(response.signature, readkeys().publicKey);
        return tranformResponse(response)
    } catch (e) {
        throw new Error('failed to send the payload')
    }
}

/**
 * Transform the input to the payload format
 * @param input 
 */
function transformPayload(input: IRequestInput): IPayload {
    const currency = input.FL_CURRENCY
    const amount = input.FL_AMOUNT
    
    const payload = {
        account: {
            currency: currency,
            amount: amount,
        }
    }
    return payload
}

/**
 * Transform the response to the expected format
 * @param response 
 */
function tranformResponse(response: IResponse): IResult {
    if (response) {
        const accountId = response.accountId
        const debit = response.transactions.find((transaction) => {
            transaction.type === TransactionType.Debit
        }).amount

        const credit = response.transactions.find((transaction) => {
            transaction.type === TransactionType.Credit
        }).amount
        return {
            FIN_ACCOUNT: accountId,
            FIN_CURRENCY: response.transactions.pop().currency,
            FIN_DEBIT: debit,
            FIN_CREDIT: credit,
        }
    }
}