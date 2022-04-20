export default class Color {
    static Empty: Color;
    static Transparent: Color;
    static Black: Color;
    static White: Color;
    static WhiteSmoke: Color;
    R: number;
    G: number;
    B: number;
    A: number;
    constructor(r: number, g: number, b: number, a?: number);
}
