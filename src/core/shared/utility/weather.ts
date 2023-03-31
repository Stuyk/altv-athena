const WEATHER_TYPE = {
    ExtraSunny: 0,
    Clear: 1,
    Clouds: 2,
    Smog: 3,
    Foggy: 4,
    Overcast: 5,
    Rain: 6,
    Thunder: 7,
    Clearing: 8,
    Neutral: 9,
    Snow: 10,
    Blizzard: 11,
    Snowlight: 12,
    Xmas: 13,
    Halloween: 14,
} as const;

export type WEATHER_KEY = keyof typeof WEATHER_TYPE;

export function getWeatherFromString(weatherName: WEATHER_KEY): number {
    return WEATHER_TYPE[weatherName];
}
