export interface BarbershopData {
    sex?: number;
    hair: number;
    dlc: number;
    hairColor1: number;
    hairColor2: number;
    hairFullName?: string;
    hairOverlay?: {
        overlay: string;
        collection: string;
    };
    eyebrowShape: number;
    eyebrowOpacity: number;
    eyebrowColor: number;
}
