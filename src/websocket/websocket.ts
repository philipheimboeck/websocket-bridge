import * as websocket from "websocket";
import * as http from "http";

export class WebSocket {

    public port:number;
    /**
     * The allowed origins array
     */
    public allowedOrigins: string[];

    /**
     * Increasing number that is used for creating identifiers
     */
    private number = 0;

    /**
     * The connections
     */
    private connections = new Map<number, websocket.connection>();

    constructor(port:number, allowedOrigins: string[]) {
        this.port = port;
        this.allowedOrigins = allowedOrigins;
    }

    /**
     * Starts the websocket service
     */
    public start() {
        const httpServer = http.createServer((req, res) => {
            console.log((new Date()) + ' Received request for ' + req.url);
            res.writeHead(404);
            res.end();
        });

        httpServer.listen(this.port, () => {
            console.log((new Date()) + ' Server is listening on port 8080');
        });


        const wsServer = new websocket.server(
            {
                httpServer: httpServer,
                autoAcceptConnections: false
            }
        )

        wsServer.on('request', this.registerConnection);
    }

    /**
     * Send data to every connected client
     * @param data the data to send to each client
     */
    public send(data:string) {
        this.connections.forEach(connection => {
            try {
                connection.send(data);
            } catch (e) {
                console.log(e);
            }
        })
    }

    /**
     * Registers a new connection
     * @param request new connection request
     */
    private registerConnection = (request: websocket.request) => {
        console.log("New request from " + request.origin);
        if (!this.originIsAllowed(request.origin)) {
            console.log("Request rejected");
            request.reject(403, "Origin not allowed");
            return;
        }

        const id = this.number++;
        const connection = request.accept(undefined, request.origin);

         console.log("Request accepted: ", id);

        connection.on('open', () => {
            connection.send('hello');
        })

        // When closing the connection, remove it from the object
        connection.on('close', (reason, description) => {
            console.log((new Date()) + "Client disconnected", reason, description);
            this.connections.delete(id);
        });

        // Define message handler
        connection.on('message', (message) => {
            console.log("Received message", message);

            if(message.type === 'utf8' && message.utf8Data !== undefined) {
                connection.sendUTF(message.utf8Data);
            } else if (message.type === 'binary' && message.binaryData !== undefined) {
                connection.sendBytes(message.binaryData);
            }
        });

        this.connections.set(id, connection);
    }

    /**
     * Checks if the origin is allowed
     * @param origin the origin to check
     */
    private originIsAllowed(origin: string): boolean {
        return this.allowedOrigins.find(o => o === origin) !== undefined
            || this.allowedOrigins.find(o => o === "*") !== undefined;
    }
}


