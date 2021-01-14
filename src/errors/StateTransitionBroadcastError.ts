export class StateTransitionBroadcastError extends Error {
    code: number;
    log: string;

    /**
     *
     * @param {number} code
     * @param {string} log
     */
    constructor(code: number, log: string) {
        super(log);

        this.code = code;
        this.log = log;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, StateTransitionBroadcastError.prototype);
    }

    /**
     * Returns error code
     * @return {number}
     */
    getCode(): number {
        return this.code;
    }

    /**
     * Returns error log
     * @return {string}
     */
    getLog(): string {
        return this.log;
    }
}