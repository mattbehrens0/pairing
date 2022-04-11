import { TransactionType } from './constants';

export interface IRequestInput  {
    FL_ACCOUNT: string,
    FL_CURRENCY: string,
    FL_AMOUNT: number
}

export interface IPayload {
	account: {
		currency: string,
		amount: number
    }
}

export interface IResponse {
    accountId: string // FL_ACCOUNT
    transactions: [{
        id: string, 
        currency: string,
        amount: number,
        type: TransactionType.Debit
    },
    {
        id: string,
        currency: string,
        amount: number,
        type: TransactionType.Credit
    }],
    signature: string
}

export interface IResult {
    FIN_ACCOUNT: string, // accountId
    FIN_CURRENCY: string,
    FIN_DEBIT: number, // amount in debit transaction
    FIN_CREDIT: number // amount in credit transaction
}
