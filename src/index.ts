import {WebSocket} from "./websocket/websocket";
import * as webhook from "./webhook/webhook";
import {Request, Response} from "express";

// Initialize the websocket
const websocket = new WebSocket(8081, ['*']);
websocket.start();

// Controller function
const controller = (req:Request, res:Response) => {
    console.log("Received request", req.body);
    websocket.send(JSON.stringify(req.body));
    res.json({state: 'success'});
};

// Initialize the webhook
webhook.init(8080, controller);
