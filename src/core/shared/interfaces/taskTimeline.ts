/**
 * Keep in mind that using a task requires a playerTask.
 * The parameters much the natives on the client-side.
 * It may be a little difficult to understand what this does.
 * Look at some the examples of where this is written.
 * @export
 * @interface Task
 */
export interface Task {
    nativeName: string;
    params: any[];
    timeToWaitInMs: number;
}

/**
 * After completing a task it calls back to the server.
 * @export
 * @interface TaskCallback
 */
export interface TaskCallback {
    callbackName: string;
}
