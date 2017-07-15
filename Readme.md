# Websocket Bridge

Forwards calls to a webhook to connected websockets.

## Installation

1. Install the project with `yarn`.

```
yarn install
``` 

2. Build the project

```
npm run build
```

3. Start the server

```
node dist/index.js
```

## Example

Start the server with `node dist/index.js` and connect with any websocket client to `ws://localhost:8081`.

Post data to `http://localhost:8080`.

```bash
curl -X POST -d '{"key":"value"}' -H "Content-Type: application/json" localhost:8080
```

On the websocket client you should now receive the json object

```json
{"key":"value"}
```

## Requirements

- node 6.11
- yarn
- typescript