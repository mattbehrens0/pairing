import * as controller from "../src/controllers/pairingController"
import * as service from "../src/services/pairingService"

describe('test', () => {
    it('should call pair function', async () => {
        const mockRequest = {
            body: [
                {
                  "FL_ACCOUNT": 'account',
                  "FL_CURRENCY": 'currency',
                  "FL_AMOUNT": 'amount'
                }
            ],
        } as any;
        const json = jest.fn()
        const mockResponse = {
            json: json,
            status: () => {
                json
            }
        } as any
        jest.spyOn(service, 'pairServ').mockResolvedValue(['a value'])
        await expect(controller.pair(mockRequest, mockResponse)).resolves.toEqual(undefined)
        expect(json).toHaveBeenCalled()
    })
})