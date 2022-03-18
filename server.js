import http from "http";
import path from "path";
import express from "express";
import dotenv from 'dotenv/config';
import cors from 'cors';
import {default as logger} from "morgan";
import { createStream } from "rotating-file-stream";
import { default as DBG } from 'debug';

import { approotdir } from "./approotdir.js";
import {normalizePort, onError, onListening} from "./utils/utils.js";

// Global variables
const __dirname = approotdir;
const debug = DBG('server:debug');
const dbgerror = DBG('server:error');

// Initialize the express app object
const app = express();

// Setting api port
export const port = normalizePort(process.env.PORT || '1337');
app.set('port', port);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'common', {
    stream: process.env.REQUEST_LOG_FILE  || 'log.txt' ?
        createStream(process.env.REQUEST_LOG_FILE || 'log.txt', {
            size: '10M',
            interval: '1d',
            compress: 'gzip',
            path: path.join(__dirname, 'logs')
        })
        : process.stdout
}));

export const server = http.createServer(app);
server.listen(port);

// Server Event handling
server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request: ${req.method} ${req.url}`);
});

server.on('error', onError)
server.on('listening', onListening)
