export function padNumber(value: number): string {
    if (value <= 9) {
        return '0' + value;
    }

    return String(value);
}
