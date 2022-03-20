import { port, server } from "../server";
import { default as DBG } from 'debug';

const debug = DBG('server:debug');
const dbgerror = DBG('server:error');

export function normalizePort (val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

export function onError(error) {
    dbgerror(error);
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

export function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug(`Listening on ${bind}`)
}

export function handle404(req, res) {
    res.status(404).json({ error: 'Not found' });
}

export function basicErrorHandler(err, req, res, next) {
    console.error("Error", err);
    res.status(500).json({
        message: err.message,
        body:{}
    });
}
