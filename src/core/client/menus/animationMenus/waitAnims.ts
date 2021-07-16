import { AnimationFlags } from '../../../shared/flags/animation';

export default (callback: Function) => {
    return [
        {
            name: 'Wait 1',
            callback,
            data: ['random@shop_tattoo', '_idle_a', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 2',
            callback,
            data: ['missbigscore2aig_3', 'wait_for_van_c', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 3',
            callback,
            data: ['amb@world_human_hang_out_street@female_hold_arm@idle_a', 'idle_a', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 4',
            callback,
            data: ['amb@world_human_hang_out_street@Female_arm_side@idle_a', 'idle_a', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 5',
            callback,
            data: ['missclothing', 'idle_storeclerk', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 6',
            callback,
            data: ['timetable@amanda@ig_2', 'ig_2_base_amanda', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 7',
            callback,
            data: ['rcmnigel1cnmt_1c', 'base', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 8',
            callback,
            data: ['rcmjosh1', 'idle', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 9',
            callback,
            data: ['rcmjosh2', 'josh_2_intp1_base', AnimationFlags.REPEAT]
        },
        {
            name: 'Wait 10',
            callback,
            data: ['timetable@amanda@ig_3', 'ig_3_base_tracy', AnimationFlags.REPEAT]
        }
    ];
};
