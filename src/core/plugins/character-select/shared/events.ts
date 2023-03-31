export const CharSelectEvents = {
    toServer: {
        select: 'char:select:character',
        delete: 'char:delete:character',
        prev: 'char:prev:character',
        next: 'char:next:character',
        new: 'char:new:character',
    },
    toClient: {
        update: 'char:select:update',
        done: 'char:select:done',
    },
    toWebview: {
        updateName: 'char:select:update:name',
    },
};
