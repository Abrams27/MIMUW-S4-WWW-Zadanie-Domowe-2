import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import {BAD_REQUEST, OK} from 'http-status-codes';
import 'express-async-errors';

import session from 'express-session'
const SQLiteStore = require('connect-sqlite3')(session);


import BaseRouter from './routes';
import logger from '@shared/Logger';
import {csrfCookieSetter, csrfProtectionMiddleware} from './middlewares/csrfMiddleware';
import {isUserLoggedMiddleware} from './middlewares/userMiddleware';

// Init express
const app = express();


/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    store: new SQLiteStore(),
    secret: 'pozdrawiamPanaCiebiere42',
    cookie: { maxAge: 10 * 60 * 1000}
}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

app.use('/static', csrfProtectionMiddleware, csrfCookieSetter, express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.redirect('/static/login.html');
});

export default app;
