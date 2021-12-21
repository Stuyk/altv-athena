import { IStreamPolygon } from '../interfaces/iStreamPolygon';
import { Vector3 } from '../interfaces/vector';

export default class Polygon {
    streamPolygon: IStreamPolygon;
    ids: Array<number> = [];

    /**
     * Creates an instance of Polygon.
     * Does not support concaved polygons.
     * Best to do simply polygon(s).
     * @param {Array<Vector3>} polygon
     * @memberof Polygon
     */
    constructor(polygon: IStreamPolygon) {
        this.streamPolygon = polygon;
    }

    /**
     * Gets the total area of the polygon.
     * @return {*}
     * @memberof Polygon
     */
    getArea() {
        let area = 0;
        let i;
        let j;
        let point1;
        let point2;

        for (i = 0, j = this.streamPolygon.vertices.length - 1; i < this.streamPolygon.vertices.length; j = i, i++) {
            point1 = this.streamPolygon.vertices[i];
            point2 = this.streamPolygon.vertices[j];
            area += point1.x * point2.y;
            area -= point1.y * point2.x;
        }

        return area / 2;
    }

    /**
     * Gets the center point of the polygon.
     * @return {*}  {Vector3}
     * @memberof Polygon
     */
    getCenter(): Vector3 {
        let x = 0;
        let y = 0;
        let i;
        let j;
        let f;
        let point1;
        let point2;

        for (i = 0, j = this.streamPolygon.vertices.length - 1; i < this.streamPolygon.vertices.length; j = i, i++) {
            point1 = this.streamPolygon.vertices[i];
            point2 = this.streamPolygon.vertices[j];
            f = point1.x * point2.y - point2.x * point1.y;
            x += (point1.x + point2.x) * f;
            y += (point1.y + point2.y) * f;
        }

        f = this.getArea() * 6;
        return { x: x / f, y: y / f, z: this.getAverageZ() };
    }

    /**
     * Gets the average Z height of all vertices.
     * @return {*}  {number}
     * @memberof Polygon
     */
    getAverageZ(): number {
        let sum = 0;

        for (let i = 0; i < this.streamPolygon.vertices.length; i++) {
            sum += this.streamPolygon.vertices[i].z;
        }

        return sum / this.streamPolygon.vertices.length;
    }

    /**
     * Used to check if a point is inside of a polygon.
     * Licensed Under MIT from https://github.com/reymond-group/smilesDrawer
     * @export
     * @param {Array<Vector3>} position
     * @param {Array<Vector2>} polygon
     * @return {boolean}
     */
    isInPolygon(position: Vector3): boolean {
        let inside = false;

        for (let i = 0, j = this.streamPolygon.vertices.length - 1; i < this.streamPolygon.vertices.length; j = i++) {
            if (
                this.streamPolygon.vertices[i].y > position.y != this.streamPolygon.vertices[j].y > position.y &&
                position.x <
                    ((this.streamPolygon.vertices[j].x - this.streamPolygon.vertices[i].x) *
                        (position.y - this.streamPolygon.vertices[i].y)) /
                        (this.streamPolygon.vertices[j].y - this.streamPolygon.vertices[i].y) +
                        this.streamPolygon.vertices[i].x
            ) {
                inside = !inside;
            }
        }

        if (this.streamPolygon.maxY) {
            const center = this.getCenter();
            if (position.z < center.z - 1.5 || position.z > center.z + this.streamPolygon.maxY) {
                inside = false;
            }
        }

        return inside;
    }

    getMaxY() {
        const center = this.getCenter();

        if (!this.streamPolygon.maxY) {
            return {
                x: center.x,
                y: center.y,
                z: center.z + 100,
            };
        }

        return {
            x: center.x,
            y: center.y,
            z: center.z + this.streamPolygon.maxY,
        };
    }

    /**
     * Check if a specific entity is inside of a polygon.
     * Emits the enter / exit events.
     * @template T
     * @param {T} entity
     * @return {*}  {boolean}
     * @memberof Polygon
     */
    isEntityInPolygon<T extends { id: number; pos: Vector3 }>(
        entity: T,
        enterEvent: (streamPolygon: IStreamPolygon) => void = null,
        leaveEvent: (streamPolygon: IStreamPolygon) => void = null,
    ): boolean {
        const isInside = this.isInPolygon(entity.pos);
        const index = this.ids.findIndex((id) => id === entity.id);

        // Is inside and first time entering.
        if (isInside && index <= -1) {
            this.ids.push(entity.id);
            if (typeof enterEvent === 'function') {
                enterEvent(this.streamPolygon);
            }
        }

        // First time leaving
        if (!isInside && index >= 0) {
            this.ids.splice(index, 1);
            if (typeof leaveEvent === 'function') {
                leaveEvent(this.streamPolygon);
            }
        }

        return isInside;
    }

    getVertices() {
        return this.streamPolygon.vertices;
    }

    getDrawLines() {
        const drawLines: Array<{ a: Vector3; b: Vector3 }> = [];

        for (let i = 0; i < this.streamPolygon.vertices.length; i++) {
            // Last Line
            if (i === this.streamPolygon.vertices.length - 1) {
                drawLines.push({ a: this.streamPolygon.vertices[i], b: this.streamPolygon.vertices[0] });
                continue;
            }

            // Rest of the Lines
            drawLines.push({ a: this.streamPolygon.vertices[i], b: this.streamPolygon.vertices[i + 1] });
        }

        return drawLines;
    }
}
