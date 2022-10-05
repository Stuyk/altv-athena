import * as alt from 'alt-server';
import { VEHICLE_HASH } from '../../../../shared/enums/VehicleHash';

const MODELS: VEHICLE_HASH[] = [
    VEHICLE_HASH.ASEA,
    VEHICLE_HASH.BALLER,
    VEHICLE_HASH.BATI,
    VEHICLE_HASH.BLAZER,
    VEHICLE_HASH.CHEETAH,
    VEHICLE_HASH.EMPEROR,
    VEHICLE_HASH.PRIMO,
    VEHICLE_HASH.TEMPESTA,
    VEHICLE_HASH.DUKES,
    VEHICLE_HASH.VIRGO,
    VEHICLE_HASH.SULTAN,
    VEHICLE_HASH.VACCA,
];

const POSITIONS: Array<{ pos: alt.Vector3; rot: alt.Vector3 }> = [
    {
        pos: new alt.Vector3(-82.74725341796875, -1405.4373779296875, 29.3135986328125),
        rot: new alt.Vector3(0, 0, 1.5831648111343384),
    },
    {
        pos: new alt.Vector3(-1076.940673828125, 464.5714416503906, 77.6387939453125),
        rot: new alt.Vector3(0, 0, -0.5936868190765381),
    },
    {
        pos: new alt.Vector3(20.149450302124023, 371.31427001953125, 112.3663330078125),
        rot: new alt.Vector3(0, 0, 0.5936868190765381),
    },
    {
        pos: new alt.Vector3(-1038.0263671875, -1234.0615234375, 5.87548828125),
        rot: new alt.Vector3(0, 0, -2.721064567565918),
    },
    {
        pos: new alt.Vector3(-1900.4703369140625, -561.1516723632812, 11.789794921875),
        rot: new alt.Vector3(0, 0, -0.7421085238456726),
    },
    {
        pos: new alt.Vector3(-1787.77587890625, -658.7999877929688, 10.4249267578125),
        rot: new alt.Vector3(0, 0, -0.7421085238456726),
    },
    {
        pos: new alt.Vector3(-1997.076904296875, 378.1054992675781, 94.4718017578125),
        rot: new alt.Vector3(0, 0, 1.632638692855835),
    },
    {
        pos: new alt.Vector3(-1028.874755859375, 695.7098999023438, 161.3487548828125),
        rot: new alt.Vector3(0, 0, 2.770538568496704),
    },
    {
        pos: new alt.Vector3(329.8813171386719, -2029.7142333984375, 21.12451171875),
        rot: new alt.Vector3(0, 0, 2.325273275375366),
    },
    {
        pos: new alt.Vector3(176.03077697753906, -66.85714721679688, 68.4556884765625),
        rot: new alt.Vector3(0, 0, -0.3957912027835846),
    },
    {
        pos: new alt.Vector3(-163.22637939453125, 932.3208618164062, 235.6395263671875),
        rot: new alt.Vector3(0, 0, -2.622116804122925),
    },
    {
        pos: new alt.Vector3(-1095.4022216796875, -887.3274536132812, 3.5838623046875),
        rot: new alt.Vector3(0, 0, -2.5231688022613525),
    },
];

export default {
    MODELS,
    POSITIONS,
};
