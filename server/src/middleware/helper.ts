import * as express from 'express';

const ERROR_HTTP_STATUS = 500;
const OK_HTTP_STATUS = 200;

// tslint:disable: no-unsafe-any
export const respond = (res: express.Response, error, data) => {
    if (error && error.code && error.message) {
        res.status(error.code);
        res.send({ error: error.message });
        return res.end()
    }
    else {
        if (error) {
            res.status(ERROR_HTTP_STATUS);
            return res.send({ error: error });
        }
        else {
            res.status(OK_HTTP_STATUS)
            return res.json({ response: data });
        }
    }
}

export const redirect = (res: express.Response, error, data) => {
    if (error && error.code && error.message) {
        res.status(error.code);
        res.send({ error: error.message });
        return res.end()
    }
    else {
        if (error) {
            res.status(ERROR_HTTP_STATUS);
            return res.send({ error: error });
        }
        else return res.redirect(data.redirect);
    }
}