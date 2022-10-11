import { ProgressBar as ProgressBarType } from '@AthenaShared/interfaces/progressBar';
import * as alt from 'alt-client';
import { AthenaClient } from '../../api/athena';

const DEFAULT_DIMENSIONS = {
    width: 200,
    height: 25,
};

type InternalProgressBar = ProgressBarType & {
    element?: alt.RmlElement;
    innerElement?: alt.RmlElement;
    markForDeletion: boolean;
};

let document: alt.RmlDocument;
let elements: Array<InternalProgressBar> = [];

const InternalFunctions = {
    getScale(dist: number, width: number, height: number, distance: number): { width: number; height: number } {
        const percentage = (distance - dist) / distance;

        return {
            width: width * percentage,
            height: height * percentage,
        };
    },
    getIndexOfElement(uid: string): number {
        return elements.findIndex((x) => x && x.uid === uid);
    },
    createElement(uid: string) {
        const index = InternalFunctions.getIndexOfElement(uid);
        if (index === -1 || typeof elements[index] === 'undefined' || typeof elements[index].element !== 'undefined') {
            return;
        }

        const backgroundBar = document.createElement('div');
        backgroundBar.addClass('bar-wrapper');
        backgroundBar.id = uid;
        elements[index].element = backgroundBar;
        document.appendChild(backgroundBar);

        const frontBar = document.createElement('div');
        frontBar.addClass('bar');
        frontBar.id = `bar-${uid}`;
        elements[index].innerElement = frontBar;
        backgroundBar.appendChild(frontBar);
    },
    removeElement(uid: string) {
        const index = InternalFunctions.getIndexOfElement(uid);
        if (index === -1 || !elements[index] || !elements[index].element) {
            return;
        }

        document.removeChild(elements[index].element);
        elements[index].innerElement.destroy();
        elements[index].innerElement = undefined;
        elements[index].element.destroy();
        elements[index].element = undefined;
    },
    update() {
        if (!document) {
            return;
        }

        for (let i = elements.length - 1; i >= 0; i--) {
            if (typeof elements[i] === 'undefined') {
                continue;
            }

            if (typeof elements[i].startTime === 'undefined') {
                elements[i].startTime = Date.now();
                elements[i].finalTime = Date.now() + elements[i].milliseconds;
            }

            const uid = elements[i].uid;
            if (elements[i].markForDeletion) {
                InternalFunctions.removeElement(uid);
                elements.splice(i, 1);
                continue;
            }

            // Handle 3D drawing of elements...
            const barPosition = elements[i].position as alt.IVector3;
            const dist = AthenaClient.utility.distance3D(alt.Player.local.pos, barPosition);

            // Removes the element from the rmlui document entirely.
            if (dist > elements[i].distance) {
                InternalFunctions.removeElement(uid);
                continue;
            }

            if (Date.now() > elements[i].finalTime) {
                elements[i].markForDeletion = true;
                continue;
            }

            // Creates the element if it does not exist.
            if (!elements[i].element) {
                try {
                    InternalFunctions.createElement(uid);
                } catch (err) {
                    console.log(err);
                }

                elements[i].element.style['background'] = 'black';
                elements[i].element.style['border'] = '2px black';
                elements[i].innerElement.style['background'] = 'white';
            }

            let width = DEFAULT_DIMENSIONS.width;
            let height = DEFAULT_DIMENSIONS.height;

            const timeLeft = elements[i].finalTime - Date.now();
            const actualTime = Math.abs(timeLeft - elements[i].milliseconds);
            const decimalPercentage = actualTime / elements[i].milliseconds;
            const actualPecentage = decimalPercentage * 100;

            // Update Scaling Here
            const fullScale = InternalFunctions.getScale(dist, width, height, elements[i].distance);

            // Update position based on world position.
            const screenPosition = alt.worldToScreen(barPosition.x, barPosition.y, barPosition.z);

            elements[i].element.style['left'] = `${screenPosition.x - width / 2}px`;
            elements[i].element.style['top'] = `${screenPosition.y - height / 2}px`;
            elements[i].element.style['min-width'] = `${fullScale.width}px`;
            elements[i].element.style['min-height'] = `${fullScale.height}px`;
            elements[i].element.style['max-width'] = `${fullScale.width}px`;
            elements[i].element.style['max-height'] = `${fullScale.height}px`;

            if (timeLeft <= 0) {
                continue;
            }

            elements[i].innerElement.style['width'] = `${actualPecentage}%`;
            elements[i].innerElement.style['height'] = `${fullScale.height}px`;
        }
    },
};

const ProgressBarConst = {
    /**
     * Create a progress bar.
     *
     * @param {ProgressBarType} bar
     */
    create(bar: ProgressBarType) {
        if (typeof document === 'undefined') {
            document = new alt.RmlDocument('/client/rmlui/progressbar/index.rml');
            document.show();
            AthenaClient.timer.createInterval(InternalFunctions.update, 0, 'rmlui/progressbar/index.ts');
        }

        const index = InternalFunctions.getIndexOfElement(bar.uid);
        if (index === -1) {
            elements.push({ ...bar, markForDeletion: false });
        } else {
            elements[index] = { ...bar, markForDeletion: false };
        }
    },
    /**
     * Remove a progress bar early.
     *
     * @param {string} uid
     * @return {*}
     */
    remove(uid: string) {
        const index = InternalFunctions.getIndexOfElement(uid);
        if (index === -1) {
            return;
        }

        elements[index].markForDeletion = true;
    },
};

export const ProgressBar = {
    ...ProgressBarConst,
};

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('progressbar | Destroyed RMLUI Document on Disconnect');
    }
});
