import * as alt from 'alt-shared';

export class DirectionVector {
    private position: alt.IVector3;
    private rotation: alt.IVector3;

    constructor(position: alt.IVector3, rotation: alt.IVector3) {
        this.position = position;
        this.rotation = rotation;
    }

    eulerToQuaternion(rotation: alt.IVector3) {
        const roll = rotation.x * (Math.PI / 180.0);
        const pitch = rotation.y * (Math.PI / 180.0);
        const yaw = rotation.z * (Math.PI / 180.0);

        const qx =
            Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) -
            Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
        const qy =
            Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2) +
            Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2);
        const qz =
            Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2) -
            Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2);
        const qw =
            Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) +
            Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);

        return { x: qx, y: qy, z: qz, w: qw };
    }

    forwardVector(): alt.IVector3 {
        const quatRot = this.eulerToQuaternion(this.rotation);
        const fVectorX = 2 * (quatRot.x * quatRot.y - quatRot.w * quatRot.z);
        const fVectorY = 1 - 2 * (quatRot.x * quatRot.x + quatRot.z * quatRot.z);
        const fVectorZ = 2 * (quatRot.y * quatRot.z + quatRot.w * quatRot.x);

        return new alt.Vector3({ x: fVectorX, y: fVectorY, z: fVectorZ });
    }

    forward(distance: number): alt.IVector3 {
        const forwardVector = this.forwardVector();

        return new alt.Vector3({
            x: this.position.x + forwardVector.x * distance,
            y: this.position.y + forwardVector.y * distance,
            z: this.position.z + forwardVector.z * distance,
        });
    }

    rightVector() {
        const quatRot = this.eulerToQuaternion(this.rotation);

        const rVectorX = 1 - 2 * (quatRot.y * quatRot.y + quatRot.z * quatRot.z);
        const rVectorY = 2 * (quatRot.x * quatRot.y + quatRot.w * quatRot.z);
        const rVectorZ = 2 * (quatRot.x * quatRot.z - quatRot.w * quatRot.y);

        return new alt.Vector3({ x: rVectorX, y: rVectorY, z: rVectorZ });
    }

    right(distance: number) {
        const rightVector = this.rightVector();

        return new alt.Vector3({
            x: this.position.x + rightVector.x * distance,
            y: this.position.y + rightVector.y * distance,
            z: this.position.z + rightVector.z * distance,
        });
    }

    upVector() {
        const quatRot = this.eulerToQuaternion(this.rotation);
        const uVectorX = 2 * (quatRot.x * quatRot.z + quatRot.w * quatRot.y);
        const uVectorY = 2 * (quatRot.y * quatRot.z - quatRot.w * quatRot.x);
        const uVectorZ = 1 - 2 * (quatRot.x * quatRot.x + quatRot.y * quatRot.y);

        return new alt.Vector3({ x: uVectorX, y: uVectorY, z: uVectorZ });
    }

    up(distance: number) {
        const upVector = this.upVector();

        return new alt.Vector3({
            x: this.position.x + upVector.x * distance,
            y: this.position.y + upVector.y * distance,
            z: this.position.z + upVector.z * distance,
        });
    }
}
