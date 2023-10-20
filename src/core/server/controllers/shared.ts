export interface ControllerFuncs<append, remove, addToPlayer = void, removeFromPlayer = void, update = void> {
    append: append;
    remove: remove;
    addToPlayer?: addToPlayer;
    removeFromPlayer?: removeFromPlayer;
    update?: update;
}
