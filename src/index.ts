
import * as express from 'express';
import * as openapi from 'express-openapi-validator';
import * as path from 'path';

function main() {
    const app = express()
    // parse the request body json
    app.use(express.json())
    // add endpoint routing
    app.use(openapi.middleware({
        apiSpec: path.join(__dirname, '../../src/spec/pairing.yaml'),
        operationHandlers: path.join(__dirname, 'controllers'),
        validateApiSpec: true,
    }))
    const port = 3000
    app.listen(port, () => {
        console.log('listening on port' + port)
    })
}
main()