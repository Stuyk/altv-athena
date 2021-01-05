/**
 * Updated every 5 seconds from systems/tick.
 * @export
 */
export function updateSyncedMetaStatesPrototype(): void {
    this.setSyncedMeta('Ping', this.ping);
    this.setSyncedMeta('Position', this.pos);
}
