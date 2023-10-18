import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { Bones } from './bones.js';
import { Events } from '../shared/events.js';

let object: alt.LocalObject;

let currentBone = 0;
let currentModel = 'prop_alien_egg_01';
let offsetPos = { x: 0, y: 0, z: 0 };
let offsetRot = { x: 0, y: 0, z: 0 };

async function destroyObject() {
    if (typeof object !== 'undefined') {
        await object.waitForSpawn();

        object.destroy();
    }

    object = undefined;
}

async function attachObject(model: string, pos: alt.IVector3, rot: alt.IVector3) {
    await destroyObject();
    await alt.Utils.waitFor(() => typeof object === 'undefined');

    currentModel = model;
    object = new alt.LocalObject(currentModel, new alt.Vector3(pos), new alt.Vector3(rot), true, false);
    object.attachToEntity(
        alt.Player.local,
        currentBone,
        new alt.Vector3(offsetPos),
        new alt.Vector3(offsetRot),
        true,
        false,
        true,
    );
}

async function createMenu() {
    offsetPos = { x: 0, y: 0, z: 0 };
    offsetRot = { x: 0, y: 0, z: 0 };
    currentModel = 'prop_alien_egg_01';
    currentBone = 0;

    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));

    await AthenaClient.rmlui.menu.create({
        header: {
            title: 'Attachment Editor',
            color: new alt.RGBA(0, 175, 250, 255),
        },
        options: [
            {
                type: 'Input',
                title: 'Model',
                description: 'Set the Prop Model',
                placeholder: 'prop_fishing_rod_01',
                async callback(model: string) {
                    const hash = alt.hash(model);
                    if (!native.isModelValid(hash)) {
                        alt.log('[Attachment Editor] Bad Model');
                        return;
                    }

                    currentModel = model;
                    attachObject(model, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                    AthenaClient.rmlui.menu.unpauseControls();
                },
            },
            {
                type: 'Selection',
                title: 'Bone',
                description: 'Set Bone Position',
                options: Bones,
                value: 0,
                async callback(bone: number) {
                    currentBone = bone;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            // offsetPos
            {
                type: 'Range',
                title: 'X',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetPos.x = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            {
                type: 'Range',
                title: 'Y',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetPos.y = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            {
                type: 'Range',
                title: 'Z',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetPos.z = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            // offsetRot
            {
                type: 'Range',
                title: 'X Rot',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetRot.x = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            {
                type: 'Range',
                title: 'Y Rot',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetRot.y = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            {
                type: 'Range',
                title: 'Z Rot',
                description: 'Increments +/- 0.01',
                value: 0,
                min: -1,
                max: 1,
                increment: 0.02,
                callback: (newValue: number) => {
                    offsetRot.z = newValue;
                    attachObject(currentModel, alt.Player.local.pos, new alt.Vector3(0, 0, 0));
                },
            },
            {
                type: 'Invoke',
                title: 'Print to Console',
                description: 'Print the attachment object to console',
                callback() {
                    alt.log({ model: currentModel, pos: offsetPos, rot: offsetRot, bone: currentBone });
                },
            },
            {
                type: 'Invoke',
                title: 'Close',
                description: 'Close the Menu',
                callback() {
                    destroyObject();
                    AthenaClient.rmlui.menu.close();
                },
            },
        ],
        callbackOnClose: destroyObject,
    });
}

alt.onServer(Events.toClient.open, createMenu);
