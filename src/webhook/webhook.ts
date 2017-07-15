import * as express from "express";
import * as bodyParser from "body-parser";

export interface callbackInterface { (req: express.Request, res: express.Response): void }

export function init(port:number, callback:callbackInterface) {
    const app = express();
    app.use(bodyParser.json());

    app.post('/', callback);

    app.listen(port);

    console.log("Webhook started");
}
