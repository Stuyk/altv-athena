import * as alt from 'alt-server';
import { VEHICLE_HASH } from '../../../../shared/enums/vehicleHash';

const MODELS: VEHICLE_HASH[] = [
    VEHICLE_HASH.ASEA,
    VEHICLE_HASH.BALLER,
    VEHICLE_HASH.BATI,
    VEHICLE_HASH.CHEETAH,
    VEHICLE_HASH.EMPEROR,
    VEHICLE_HASH.PRIMO,
    VEHICLE_HASH.TEMPESTA,
    VEHICLE_HASH.DUKES,
    VEHICLE_HASH.VIRGO,
    VEHICLE_HASH.SULTAN,
    VEHICLE_HASH.VACCA,
    VEHICLE_HASH.CHEETAH2,
    VEHICLE_HASH.COMET2,
    VEHICLE_HASH.COGNOSCENTI,
    VEHICLE_HASH.WASHINGTON,
    VEHICLE_HASH.DAEMON,
    VEHICLE_HASH.SENTINEL,
    VEHICLE_HASH.MANANA,
];

const POSITIONS: Array<{ pos: alt.Vector3; rot: number }> = [
    {
        pos: new alt.Vector3(-82.74725341796875, -1405.4373779296875, 29.3135986328125),
        rot: 1.5831648111343384,
    },
    {
        pos: new alt.Vector3(-1076.940673828125, 464.5714416503906, 77.6387939453125),
        rot: -0.5936868190765381,
    },
    {
        pos: new alt.Vector3(20.149450302124023, 371.31427001953125, 112.3663330078125),
        rot: 0.5936868190765381,
    },
    {
        pos: new alt.Vector3(-1038.0263671875, -1234.0615234375, 5.87548828125),
        rot: -2.721064567565918,
    },
    {
        pos: new alt.Vector3(-1900.4703369140625, -561.1516723632812, 11.789794921875),
        rot: -0.7421085238456726,
    },
    {
        pos: new alt.Vector3(-1787.77587890625, -658.7999877929688, 10.4249267578125),
        rot: -0.7421085238456726,
    },
    {
        pos: new alt.Vector3(-1997.076904296875, 378.1054992675781, 94.4718017578125),
        rot: 1.632638692855835,
    },
    {
        pos: new alt.Vector3(-1028.874755859375, 695.7098999023438, 161.3487548828125),
        rot: 2.770538568496704,
    },
    {
        pos: new alt.Vector3(329.8813171386719, -2029.7142333984375, 21.12451171875),
        rot: 2.325273275375366,
    },
    {
        pos: new alt.Vector3(176.03077697753906, -66.85714721679688, 68.4556884765625),
        rot: -0.3957912027835846,
    },
    {
        pos: new alt.Vector3(-163.22637939453125, 932.3208618164062, 235.6395263671875),
        rot: -2.622116804122925,
    },
    {
        pos: new alt.Vector3(-1095.4022216796875, -887.3274536132812, 3.5838623046875),
        rot: -2.5231688022613525,
    },
    {
        pos: new alt.Vector3(107.89450073242188, 497.6703186035156, 147.0263671875),
        rot: -2.9684340953826904,
    },
    {
        pos: new alt.Vector3(-78.46153259277344, 497.23516845703125, 144.3135986328125),
        rot: 2.820012331008911,
    },
    {
        pos: new alt.Vector3(-360.1318664550781, 514.4835205078125, 119.5780029296875),
        rot: 2.325273275375366,
    },
    {
        pos: new alt.Vector3(-408.6461486816406, 559.87255859375, 124.245361328125),
        rot: -0.44526514410972595,
    },
    {
        pos: new alt.Vector3(-699.94287109375, -1107.3758544921875, 14.4183349609375),
        rot: 0.5442129373550415,
    },
    {
        pos: new alt.Vector3(-641.9736328125, -1221.019775390625, 11.2674560546875),
        rot: -1.0389518737792969,
    },
    {
        pos: new alt.Vector3(-477.0725402832031, -787.6483764648438, 35.2784423828125),
        rot: 1.5336909294128418,
    },
];

const SPEECHES = [
    'Now get your ass back over here!',
    'Marvelous, drive it back here ASAP!',
    'Great, I knew I could count on you!',
    'Oh yes! Come back quick!',
    "Can't wait to see that baby again!",
    'Continue like that you will be employee of the month!',
    'Good, now come back here!',
    'You are da man!',
];

export default {
    MODELS,
    POSITIONS,
    SPEECHES,
};
