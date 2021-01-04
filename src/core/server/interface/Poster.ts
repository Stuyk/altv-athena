/**
 * The encrypted poster data from poster to send.
 * @export
 * @interface PosterFormat
 */
export interface PosterFormat {
    public_key: string;
    encryption: string;
}

/**
 * The unencrypted poster data for ares to process.
 * @export
 * @interface Poster
 */
export interface Poster {
    gumroad_key: string;
    email: string;
    data: any;
}
