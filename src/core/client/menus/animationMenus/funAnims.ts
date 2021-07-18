import { AnimationFlags } from '../../../shared/flags/animation';

export default (callback: Function) => {
    return [
        {
            name: 'Air Guitar',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@air_guitar', 'air_guitar', AnimationFlags.REPEAT]
        },
        {
            name: 'Air Synth',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@air_synth', 'air_synth', AnimationFlags.REPEAT]
        },
        {
            name: 'Argue 1',
            callback,
            data: ['misscarsteal4@actor', 'actor_berating_loop', AnimationFlags.REPEAT]
        },
        {
            name: 'Argue 2',
            callback,
            data: ['oddjobs@assassinate@vice@hooker', 'argue_a', AnimationFlags.REPEAT]
        },
        {
            name: 'Blow Kiss 1',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@blow_kiss', 'blow_kiss', AnimationFlags.NORMAL]
        },
        {
            name: 'Blow Kiss 2',
            callback,
            data: ['anim@mp_player_intselfieblow_kiss', 'exit', AnimationFlags.NORMAL]
        },
        {
            name: 'Curtsy',
            callback,
            data: ['anim@mp_player_intcelebrationpaired@f_f_sarcastic', 'sarcastic_left', AnimationFlags.NORMAL]
        },
        {
            name: 'Bring It',
            callback,
            data: ['misscommon@response', 'bring_it_on', AnimationFlags.NORMAL]
        },
        {
            name: 'Come At Me',
            callback,
            data: ['mini@triathlon', 'want_some_of_this', AnimationFlags.NORMAL]
        },
        {
            name: 'Jazz Hands',
            callback,
            data: ['anim@mp_player_intcelebrationfemale@jazz_hands', 'jazz_hands', AnimationFlags.NORMAL]
        }
    ];
};
