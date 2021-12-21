export default interface IHudComponent {
    callback: (propName: string) => void;
    msBetweenUpdates: number;
    lastUpdate?: number;
}
