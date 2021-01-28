export interface ClothingComponent {
    name: string;
    ids: Array<number>;
    drawables: Array<number>;
    textures: Array<number>;
    isProp: boolean;
    maxDrawables?: Array<number>;
    maxTextures?: Array<number>;
}
