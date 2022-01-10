/**
 * Useful for getting a boolean and a message back.
 * Mostly used by the faction system.
 * @export
 * @interface IResponse
 */
export interface IResponse {
    /**
     * Did this function pass or fail.
     * @type {boolean}
     * @memberof IResponse
     */
    status: boolean;

    /**
     * What was the reason why it passed or failed.
     * @type {string}
     * @memberof IResponse
     */
    response: string;
}

export interface IGenericResponse<ReturnType> {
    /**
     * Did this function pass or fail.
     * @type {boolean}
     * @memberof IResponse
     */
    status: boolean;

    /**
     * What was the reason why it passed or failed.
     * @type {ReturnType}
     * @memberof IResponse
     */
    response: ReturnType;
}
