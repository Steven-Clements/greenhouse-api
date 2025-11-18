/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* index.js | {√}                                       @packageDocumentation *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* The main entry point for the Greenhouse API server. This file configures   *|
|* packages, initializes middleware, and specifies how to use these assets to *|
|* process and route requests to an appropriate controller.                   *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import express from 'express';
import dotenv from 'dotenv';


/* —————————————————————————————————————————————————————————————————————————— *\
| Load environment variables                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
dotenv.config();


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import dispatchRequest from './routes/dispatch-request.js';
import log from './utilities/logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper variables                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const port = parseInt(process.env.PORT) || 5000;
const environment = process.env.NODE_ENV || 'development';
const basePath = process.env.RENDER_EXTERNAL_URL || process.env.BASE_PATH || 'http://localhost:5000';
const shutdownTimeoutMs = parseInt(process.env.SHUTDOWN_TIMEOUT_MS) || 5000;


/* —————————————————————————————————————————————————————————————————————————— *\
| Immediately Invoked Functional Expression (IIEF)                             |
\* —————————————————————————————————————————————————————————————————————————— */
(async () => {
    try {
        /* —————————————————————————————————————————————————————————————————————————— *\
        | Initialize Greenhouse application                                            |
        \* —————————————————————————————————————————————————————————————————————————— */
        const app = express();


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Initialize middleware                                                        |
        \* —————————————————————————————————————————————————————————————————————————— */
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Define API routes                                                            |
        \* —————————————————————————————————————————————————————————————————————————— */
        app.use('/', dispatchRequest);


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Listen for requests                                                          |
        \* —————————————————————————————————————————————————————————————————————————— */
        const server = app.listen(port, () => {
            log('info',`Greenhouse API server started successfully in the "${environment}" environment.`);
            log('info', `Listening for requests at ${basePath}...`);
        });


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Register OS signal listeners                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        process.on('uncaughtException', (error) => {
            log ('error', `UNCAUGHT EXCEPTION`, {
                name: error.name, message: error.message, stack: error.stack
            });

            attemptGracefulShutdown('uncaughtException', server);
        });
        process.on('unhandledRejection', (reason) => {
            if (reason instanceof Error) {
                log ('error', `UNHANDLED REJECTION`, {
                    name: reason.name, message: reason.message, stack: reason.stack
                });
            } else {
                log ('error', `UNHANDLED REJECTION`, {
                    message: reason
                });
            }

            attemptGracefulShutdown('unhandledRejection', server)
        });
        process.on('SIGINT', () => attemptGracefulShutdown('signalInterrupt', server));
        process.on('SIGTERM', () => attemptGracefulShutdown('signalTerminate', server));
    } catch (bootError) {
        log ('error', `BOOT ERROR >> The server failed to start correctly.`, {
            name: bootError.name, message: bootError.message, stack: bootError.stack
        });

        /* —————————————————————————————————————————————————————————————————————————— *\
        | Exit code 1 | Boot error                                                     |
        \* —————————————————————————————————————————————————————————————————————————— */
        process.exit(1);
    }
})();
        


/* —————————————————————————————————————————————————————————————————————————— *\
| Attempt graceful shutdown                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module attemptGracefulShutdown
 * 
 * Attempts to close connections with external resources, flush logs, and
 * enforces a server timeout when signals or errors cause the server to shut
 * down unexpectedly.
 * 
 * @param {string} signal
 * The OS signal triggering the graceful shutdown.
 * 
 * @param {import('http').Server} server
 * The HTTP server running on the current node.js process.
 */
export default async function attemptGracefulShutdown(signal, server) {
    log('warn', `Detected ${signal} signal. Attempting graceful shutdown...`);

    try {
        const shutdownTimeout = setTimeout(() => {
            log('error', 'Shutdown timed out, forcing exit');
            process.exit(1);
        }, shutdownTimeoutMs);

        server.close(() => {
            clearTimeout(shutdownTimeout);
            
            log('info', 'Closing HTTP server process...');

            /* —————————————————————————————————————————————————————————————————————————— *\
            | Exit code 0 | Clean exit                                                     |
            \* —————————————————————————————————————————————————————————————————————————— */
            process.exit(0);
        });

    } catch (shutdownError) {
        const timestamp = new Date().toTimeString();

        log ('error', `Failed to complete cleanup`, {
            name: shutdownError.name, message: shutdownError.message, stack: shutdownError.stack
        });

        /* —————————————————————————————————————————————————————————————————————————— *\
        | Exit code 2 | Shutdown error                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        process.exit(2);
    }
}
