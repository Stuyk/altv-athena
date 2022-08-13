import alt from 'alt-client';
import natives from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.TICKS_START, fixMissingInteriors);

function fixMissingInteriors() {
    alt.requestIpl('bh1_47_joshhse_unburnt');
    alt.requestIpl('ex_dt1_02_office_02b');
    alt.requestIpl('chop_props');
    alt.requestIpl('FIBlobby');
    alt.removeIpl('FIBlobbyfake');
    alt.requestIpl('FBI_colPLUG');
    alt.requestIpl('FBI_repair');
    alt.requestIpl('v_tunnel_hole');
    alt.requestIpl('TrevorsMP');
    alt.requestIpl('TrevorsTrailer');
    alt.requestIpl('TrevorsTrailerTidy');
    alt.removeIpl('farm_burnt');
    alt.removeIpl('farm_burnt_lod');
    alt.removeIpl('farm_burnt_props');
    alt.removeIpl('farmint_cap');
    alt.removeIpl('farmint_cap_lod');
    alt.requestIpl('farm');
    alt.requestIpl('farmint');
    alt.requestIpl('farm_lod');
    alt.requestIpl('farm_props');
    alt.requestIpl('facelobby');
    alt.removeIpl('CS1_02_cf_offmission');
    alt.requestIpl('CS1_02_cf_onmission1');
    alt.requestIpl('CS1_02_cf_onmission2');
    alt.requestIpl('CS1_02_cf_onmission3');
    alt.requestIpl('CS1_02_cf_onmission4');
    alt.requestIpl('v_rockclub');
    alt.requestIpl('v_janitor');
    alt.removeIpl('hei_bi_hw1_13_door');
    alt.requestIpl('bkr_bi_hw1_13_int');
    alt.requestIpl('ufo');
    alt.requestIpl('ufo_lod');
    alt.requestIpl('ufo_eye');
    alt.removeIpl('v_carshowroom');
    alt.removeIpl('shutter_open');
    alt.removeIpl('shutter_closed');
    alt.removeIpl('shr_int');
    alt.requestIpl('v_carshowroom');
    alt.requestIpl('smboat');
    alt.requestIpl('smboat_distantlights');
    alt.requestIpl('smboat_lod');
    alt.requestIpl('smboat_lodlights');
    alt.requestIpl('cargoship');
    alt.requestIpl('railing_start');
    alt.removeIpl('sp1_10_fake_interior');
    alt.removeIpl('sp1_10_fake_interior_lod');
    alt.requestIpl('sp1_10_real_interior');
    alt.requestIpl('sp1_10_real_interior_lod');
    alt.removeIpl('id2_14_during_door');
    alt.removeIpl('id2_14_during1');
    alt.removeIpl('id2_14_during2');
    alt.removeIpl('id2_14_on_fire');
    alt.removeIpl('id2_14_post_no_int');
    alt.removeIpl('id2_14_pre_no_int');
    alt.removeIpl('id2_14_during_door');
    alt.requestIpl('id2_14_during1');
    alt.removeIpl('Coroner_Int_off');
    alt.requestIpl('coronertrash');
    alt.requestIpl('Coroner_Int_on');
    alt.removeIpl('bh1_16_refurb');
    alt.removeIpl('jewel2fake');
    alt.removeIpl('bh1_16_doors_shut');
    alt.requestIpl('refit_unload');
    alt.requestIpl('post_hiest_unload');
    alt.requestIpl('Carwash_with_spinners');
    alt.requestIpl('KT_CarWash');
    alt.requestIpl('ferris_finale_Anim');
    alt.removeIpl('ch1_02_closed');
    alt.requestIpl('ch1_02_open');
    alt.requestIpl('AP1_04_TriAf01');
    alt.requestIpl('CS2_06_TriAf02');
    alt.requestIpl('CS4_04_TriAf03');
    alt.removeIpl('scafstartimap');
    alt.requestIpl('scafendimap');
    alt.removeIpl('DT1_05_HC_REMOVE');
    alt.requestIpl('DT1_05_HC_REQ');
    alt.requestIpl('DT1_05_REQUEST');
    alt.requestIpl('dt1_05_hc_remove');
    alt.requestIpl('dt1_05_hc_remove_lod');
    alt.requestIpl('FINBANK');
    alt.removeIpl('DT1_03_Shutter');
    alt.removeIpl('DT1_03_Gr_Closed');
    alt.requestIpl('golfflags');
    alt.requestIpl('airfield');
    alt.requestIpl('v_garages');
    alt.requestIpl('v_foundry');
    alt.requestIpl('hei_yacht_heist');
    alt.requestIpl('hei_yacht_heist_Bar');
    alt.requestIpl('hei_yacht_heist_Bedrm');
    alt.requestIpl('hei_yacht_heist_Bridge');
    alt.requestIpl('hei_yacht_heist_DistantLights');
    alt.requestIpl('hei_yacht_heist_enginrm');
    alt.requestIpl('hei_yacht_heist_LODLights');
    alt.requestIpl('hei_yacht_heist_Lounge');
    alt.requestIpl('hei_carrier');
    alt.requestIpl('hei_Carrier_int1');
    alt.requestIpl('hei_Carrier_int2');
    alt.requestIpl('hei_Carrier_int3');
    alt.requestIpl('hei_Carrier_int4');
    alt.requestIpl('hei_Carrier_int5');
    alt.requestIpl('hei_Carrier_int6');
    alt.requestIpl('hei_carrier_LODLights');
    alt.requestIpl('bkr_bi_id1_23_door');
    alt.requestIpl('lr_cs6_08_grave_closed');
    alt.requestIpl('hei_sm_16_interior_v_bahama_milo_');
    alt.requestIpl('CS3_07_MPGates');
    alt.requestIpl('cs5_4_trains');
    alt.requestIpl('v_lesters');
    alt.requestIpl('v_trevors');
    alt.requestIpl('v_michael');
    alt.requestIpl('v_comedy');
    alt.requestIpl('v_cinema');
    alt.requestIpl('V_Sweat');
    alt.requestIpl('V_35_Fireman');
    alt.requestIpl('redCarpet');
    alt.requestIpl('triathlon2_VBprops');
    alt.requestIpl('jetstenativeurnel');
    alt.requestIpl('Jetsteal_ipl_grp1');
    alt.requestIpl('sf_musicrooftop');

    // Hospital Pillbox Interiors
    alt.requestIpl('RC12B_Default');

    // Canyon
    alt.requestIpl('canyonriver01');
    alt.requestIpl('canyonriver01_lod');
    alt.requestIpl('cs3_05_water_grp1');
    alt.requestIpl('cs3_05_water_grp1_lod');
    alt.requestIpl('trv1_trail_start');
    alt.requestIpl('CanyonRvrShallow');

    // CASINO
    alt.requestIpl('vw_casino_penthouse');
    alt.requestIpl('vw_casino_main');
    alt.requestIpl('vw_casino_carpark');
    alt.requestIpl('vw_dlc_casino_door');
    alt.requestIpl('vw_casino_door');
    alt.requestIpl('hei_dlc_windows_casino');
    alt.requestIpl('hei_dlc_casino_door');
    alt.requestIpl('hei_dlc_casino_aircon');
    alt.requestIpl('vw_casino_garage');

    let interiorID = natives.getInteriorAtCoords(1100.0, 220.0, -50.0);
    if (natives.isValidInterior(interiorID)) {
        natives.activateInteriorEntitySet(interiorID, '0x30240D11');
        natives.activateInteriorEntitySet(interiorID, '0xA3C89BB2');
        natives.refreshInterior(interiorID);
    }

    interiorID = natives.getInteriorAtCoords(976.6364, 70.29476, 115.1641);
    if (natives.isValidInterior(interiorID)) {
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Tint_Shell');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Pattern_09');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Spa_Bar_Open');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Media_Bar_Open');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Arcade_Modern');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Bar_Clutter');
        natives.activateInteriorEntitySet(interiorID, 'Set_Pent_Clutter_03');
        natives.activateInteriorEntitySet(interiorID, 'Set_pent_bar_light_02');
        natives.refreshInterior(interiorID);
    }

    // Car Meet
    alt.requestIpl('tr_tuner_meetup');
    alt.requestIpl('tr_tuner_race_line');

    interiorID = 286209;
    if (natives.isValidInterior(interiorID)) {
        natives.activateInteriorEntitySet(interiorID, 'entity_set_meet_lights');
        natives.activateInteriorEntitySet(interiorID, 'entity_set_meet_lights_cheap');
        natives.activateInteriorEntitySet(interiorID, 'entity_set_test_lights');
        natives.activateInteriorEntitySet(interiorID, 'entity_set_test_lights_cheap');
        natives.activateInteriorEntitySet(interiorID, 'entity_set_time_trial');
        natives.refreshInterior(interiorID);
    }

    // Premium Deluxe Motorsport
    alt.requestIpl('shr_int');

	interiorID = natives.getInteriorAtCoords(-31.328518, -1106.6293, 25.42235);
    if (natives.isValidInterior(interiorID)) {
        natives.activateInteriorEntitySet(interiorID, 'csr_beforeMission');
        natives.activateInteriorEntitySet(interiorID, 'shutter_closed'); // back door closed or uncomment this for open.
        natives.refreshInterior(interiorID);
    }
}
