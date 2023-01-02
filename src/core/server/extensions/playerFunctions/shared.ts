import * as alt from 'alt-server';
import { Character } from '@AthenaShared/interfaces/character';

export type ReadOnlyPlayer = Readonly<alt.Player & { data: Character }>;
