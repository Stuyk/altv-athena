export default class Point {
    X: number;
    Y: number;
    constructor(x: number, y: number);
    static Parse(point: number[]): Point;
    static Parse(point: {
        X: number;
        Y: number;
    }): Point;
}
