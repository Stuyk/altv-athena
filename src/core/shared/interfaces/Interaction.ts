import { Blip } from './Blip';

export interface Interaction {
    identifier: string;
    text: string;
    blip: Blip;
}
