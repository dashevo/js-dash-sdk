export class StateTransitionBroadcastError extends Error {
    code: number;
    message: string;
    data: any;

    /**
     *
     * @param {number} code
     * @param {string} message
     * @param {*} data
     */
    constructor(code: number, message: string, data: any) {
        const firstError = data.errors;
        const detailedMessage = `${message}: ${firstError.name} ${firstError.message}`;
        super(detailedMessage);

        this.code = code;
        this.message = detailedMessage;
        this.data = data;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, StateTransitionBroadcastError.prototype);
    }

    /**
     * Returns error code
     *
     * @return {number}
     */
    getCode(): number {
        return this.code;
    }

    /**
     * Returns error message
     *
     * @return {string}
     */
    getMessage(): string {
        return this.message;
    }

    /**
     * Get error data
     *
     * @return {*}
     */
    getData(): any {
        return this.data;
    }
}
