interface ControllerFuncs<append, remove, addToPlayer = void, removeFromPlayer = void> {
    append: append;
    remove: remove;
    addToPlayer?: addToPlayer;
    removeFromPlayer?: removeFromPlayer;
}
