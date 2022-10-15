export type OnFinishDrag = (startType: string, startIndex: number, endType: string, endIndex: number) => void;
export type DragInfo = (type: string, index: number) => void;
export type Draggable = { endDrag: OnFinishDrag; canBeDragged?: boolean; singleClick?: DragInfo; startDrag?: DragInfo };

const TIME_FOR_FAST_CLICK = 250;

let isDragging = false;
let clonedElement: HTMLElement;
let onFinishDragCallback: OnFinishDrag;
let onSingleClickCallback: DragInfo;
let onStartDraggingCallback: DragInfo;
let startID: string;
let startClickTime: number;

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

    if (!isDragging && Date.now() > startClickTime + TIME_FOR_FAST_CLICK) {
        isDragging = true;
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
    if (id && onFinishDragCallback && id !== startID && id.includes('-')) {
        const startDrag = startID.split('-');
        const endDrag = id.split('-');
        if (typeof onFinishDragCallback === 'function') {
            onFinishDragCallback(startDrag[0], parseInt(startDrag[1]), endDrag[0], parseInt(endDrag[1]));
            onFinishDragCallback = undefined;
        }
    }

    if (onSingleClickCallback && !isDragging) {
        isDragging = false;
        const startDrag = startID.split('-');
        onSingleClickCallback(startDrag[0], parseInt(startDrag[1]));
    }

    removeEvents();
}

function makeDraggable(ev: MouseEvent, draggable: Draggable) {
    isDragging = false;
    if (draggable.canBeDragged === false) {
        return;
    }

    if ('which' in ev) {
        if (ev.which === 3) {
            return;
        }
    }

    startClickTime = Date.now();

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

    onFinishDragCallback = draggable.endDrag;
    onSingleClickCallback = draggable.singleClick;
    onStartDraggingCallback = draggable.startDrag;

    setTimeout(() => {
        if (!isDragging) {
            return;
        }

        if (typeof onStartDraggingCallback === 'function') {
            const dragInfo = startID.split('-');
            onStartDraggingCallback(dragInfo[0], parseInt(dragInfo[1]));
        }
    }, TIME_FOR_FAST_CLICK + 50);
}

function removeEvents() {
    window.removeEventListener('mouseup', mouseUp);
    window.removeEventListener('mousemove', mouseMove);
}

export { makeDraggable, removeEvents };
