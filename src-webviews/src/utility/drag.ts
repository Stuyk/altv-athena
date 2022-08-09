export type OnFinishDrag = (startType: string, startIndex: number, endType: string, endIndex: number) => void;

let clonedElement: HTMLElement;
let callback: OnFinishDrag;
let startID: string;

function getID(ev: MouseEvent): string | undefined {
    let id: string;

    if (ev.target['id']) {
        id = ev.target['id'];
    }

    return id;
}

function mouseMove(ev: MouseEvent) {
    if (!clonedElement) {
        return;
    }

    clonedElement.classList.add('clone');
    clonedElement.style.left = `${ev.clientX}px`;
    clonedElement.style.top = `${ev.clientY}px`;
}

function mouseUp(ev: MouseEvent) {
    if (clonedElement) {
        clonedElement.remove();
        clonedElement = undefined;
    }

    const id = getID(ev);
    if (id && callback && id !== startID && id.includes('-')) {
        const startDrag = startID.split('-');
        const endDrag = id.split('-');
        if (typeof callback === 'function') {
            callback(startDrag[0], parseInt(startDrag[1]), endDrag[0], parseInt(endDrag[1]));
            callback = undefined;
        }
    }

    removeEvents();
}

function makeDraggable(ev: MouseEvent, _callback: OnFinishDrag, canBeDragged = false) {
    if (canBeDragged === false) {
        return;
    }

    if ('which' in ev) {
        if (ev.which === 3) {
            return;
        }
    }

    const id = getID(ev);
    if (!id) {
        console.warn(
            `Draggable slot did not have an 'type-number' assigned to the id property. Add id to your html element.`,
        );
        return;
    }

    startID = id;

    const element = document.getElementById(id);
    clonedElement = element.cloneNode(true) as HTMLElement;
    document.body.append(clonedElement);

    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mousemove', mouseMove);

    callback = _callback;
}

function removeEvents() {
    window.removeEventListener('mouseup', mouseUp);
    window.removeEventListener('mousemove', mouseMove);
}

export default {
    makeDraggable,
    removeEvents,
};
