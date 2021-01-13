export class TransitionBroadcastError extends Error {
    code: number;
    log: string;

    constructor(code, log) {
        super(log);

        this.code = code;
        this.log = log;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, TransitionBroadcastError.prototype);
    }

    getCode() {
        return this.code;
    }

    getLog() {
        return this.log;
    }
}