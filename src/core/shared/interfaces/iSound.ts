interface BaseSound {
    dimension?: number;
}

export interface ISound extends BaseSound {
    /**
     * The name of the audio that you want to play.
     * **DO NOT** append `.ogg`.
     *
     * @type {string}
     * @memberof ISound
     */
    name: string;

    /**
     * How loud the audio should be.
     * Usually recommend around 0.35.
     *
     * Does not apply to 3D sounds based on distance.
     *
     * @type {number}
     * @memberof ISound
     */
    volume?: number;
}

export interface IFrontendSound extends BaseSound {
    /**
     * The name of the frontend audio.
     *
     * https://altv.stuyk.com/docs/articles/tables/frontend-sounds.html
     *
     * @type {string}
     * @memberof IFrontendSound
     */
    audioName: string;

    /**
     * The Ref/Dictionary of the frontend audio.
     *
     * @type {string}
     * @memberof IFrontendSound
     */
    ref: string;
}
