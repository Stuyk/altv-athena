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
    eyeIndex: number;
    eyeOpacity: number;
    eyeColor1: number;
    beardIndex: number;
    beardOpacity: number;
    beardColor1: number;
    makeupIndex: number;
    makeupOpacity: number;
    makeupColor1: number;
}
