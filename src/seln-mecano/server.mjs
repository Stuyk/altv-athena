/** Import of the incredible functions of ALTV */
import * as alt from 'alt';

/**
 * On Client : Asking the needed data to open menu :
 *      Set correct modkit
 *      Need all mods count
 *      Need all current mods
 *      Send the passed args and the acquired datas
 */
alt.onClient('seln:mecha:getmodscount', (player, type, nblivery, nbroofs) => {

    let vehicle = player.vehicle
    /* 
     never understood modkit to be honest but sound it always 
     need to be 1 except for vehicle that cannot be customised ( like army mesa )
    */
    try {
        vehicle.modKit = 1;
    } catch (error) {
        vehicle.modKit = 0;
    }
    
    let modscount = {}
    modscount.spoiler=    vehicle.getModsCount(0);
    modscount.fbumper=    vehicle.getModsCount(1);
    modscount.rbumper=    vehicle.getModsCount(2);
    modscount.sskirt=     vehicle.getModsCount(3);
    modscount.exhaust=    vehicle.getModsCount(4);
    modscount.frame=      vehicle.getModsCount(5);
    modscount.grille=     vehicle.getModsCount(6);
    modscount.hood=       vehicle.getModsCount(7);
    modscount.lwing=      vehicle.getModsCount(8);
    modscount.rwing=      vehicle.getModsCount(9);
    modscount.roof=       vehicle.getModsCount(10);

    modscount.engine=     vehicle.getModsCount(11);
    modscount.brakes=     vehicle.getModsCount(12);
    modscount.trans=      vehicle.getModsCount(13);
    modscount.horns=      vehicle.getModsCount(14);
    modscount.suspension= vehicle.getModsCount(15);
    modscount.armor=      vehicle.getModsCount(16);
    modscount.turbo=      vehicle.getModsCount(18);

    modscount.xenon=      vehicle.getModsCount(22);
    modscount.fwheels=    vehicle.getModsCount(23);
    modscount.bwheels=    vehicle.getModsCount(24);
    modscount.plateh=     vehicle.getModsCount(25);
    modscount.platev=     vehicle.getModsCount(26);
    modscount.trimdesign= vehicle.getModsCount(27);
    modscount.ornaments=  vehicle.getModsCount(28);
    modscount.dialdesign= vehicle.getModsCount(30);
    modscount.doorint=    vehicle.getModsCount(31);
    modscount.seats=      vehicle.getModsCount(32);
    modscount.steeringw=  vehicle.getModsCount(33);
    modscount.shiftlever= vehicle.getModsCount(34);
    modscount.plaques=    vehicle.getModsCount(35);
    modscount.hydraulics= vehicle.getModsCount(38);
    modscount.engineb=    vehicle.getModsCount(39);
    modscount.airfilter=  vehicle.getModsCount(40);
    modscount.strutbar=   vehicle.getModsCount(41);
    modscount.archcover=  vehicle.getModsCount(42);
    modscount.antenna=    vehicle.getModsCount(43);
    modscount.exteriorp=  vehicle.getModsCount(44);
    modscount.tank=       vehicle.getModsCount(45);
    modscount.door=       vehicle.getModsCount(46);
    modscount.wroh=       vehicle.getModsCount(47);
    modscount.stickers=   vehicle.getModsCount(48);
    modscount.plate=      vehicle.getModsCount(53);
    modscount.windowtint= vehicle.getModsCount(55); 

    modscount.tint= 5;

    let currentmods = {}
    currentmods.spoiler=    vehicle.getMod(0);
    currentmods.fbumper=    vehicle.getMod(1);
    currentmods.rbumper=    vehicle.getMod(2);
    currentmods.sskirt=     vehicle.getMod(3);
    currentmods.exhaust=    vehicle.getMod(4);
    currentmods.frame=      vehicle.getMod(5);
    currentmods.grille=     vehicle.getMod(6);
    currentmods.hood=       vehicle.getMod(7);
    currentmods.lwing=      vehicle.getMod(8);
    currentmods.rwing=      vehicle.getMod(9);
    currentmods.roof=       vehicle.getMod(10);

    currentmods.engine=     vehicle.getMod(11);
    currentmods.brakes=     vehicle.getMod(12);
    currentmods.trans=      vehicle.getMod(13);
    currentmods.horns=      vehicle.getMod(14);
    currentmods.suspension= vehicle.getMod(15);
    currentmods.armor=      vehicle.getMod(16);
    currentmods.turbo=      vehicle.getMod(18);

    currentmods.xenon=      vehicle.getMod(22);
    currentmods.fwheels=    vehicle.getMod(23);
    currentmods.bwheels=    vehicle.getMod(24);
    currentmods.plateh=     vehicle.getMod(25);
    currentmods.platev=     vehicle.getMod(26);
    currentmods.trimdesign= vehicle.getMod(27);
    currentmods.ornaments=  vehicle.getMod(28);
    currentmods.dialdesign= vehicle.getMod(30);
    currentmods.doorint=    vehicle.getMod(31);
    currentmods.seats=      vehicle.getMod(32);
    currentmods.steeringw=  vehicle.getMod(33);
    currentmods.shiftlever= vehicle.getMod(34);
    currentmods.plaques=    vehicle.getMod(35);
    currentmods.hydraulics= vehicle.getMod(38);
    currentmods.engineb=    vehicle.getMod(39);
    currentmods.airfilter=  vehicle.getMod(40);
    currentmods.strutbar=   vehicle.getMod(41);
    currentmods.archcover=  vehicle.getMod(42);
    currentmods.antenna=    vehicle.getMod(43);
    currentmods.exteriorp=  vehicle.getMod(44);
    currentmods.tank=       vehicle.getMod(45);
    currentmods.door=       vehicle.getMod(46);
    currentmods.wroh=       vehicle.getMod(47);
    currentmods.stickers=   vehicle.getMod(48);
    currentmods.plate=      vehicle.getMod(53);
    currentmods.windowtint= vehicle.getMod(55);

    alt.emitClient(player, 'seln:mecha:getmodscountanswer', type, nblivery, nbroofs, modscount, currentmods); 
});



/**
 * On Client : Set color 
 *      Set the correct color to chosen part of vehiclE
 */
alt.onClient('seln:mecha:color', (player, type, couleur) => {

    let vehicle = player.vehicle ? player.vehicle : null;

    if(type == 'Principale'){ vehicle.primaryColor = couleur.id; }
    else if(type == 'Secondaire'){ vehicle.secondaryColor = couleur.id; }
    else if(type == 'Reflets'){ vehicle.pearlColor = couleur.id; }
    else if(type == 'Jantes'){ vehicle.wheelColor = couleur.id; }
    else if(type == 'Interieur'){ vehicle.interiorColor = couleur.id; } 

});




/**
 * On Client : Set neon color 
 *      Translate HEX color to RGB color
 *      Set neon color to translated RGB
 */
alt.onClient('seln:mecha:neon', (player, hex) => {

    let vehicle = player.vehicle ? player.vehicle : null;
    let rgb = hexToRgb(hex)
    vehicle.neonColor = {r: rgb.r, g: rgb.g, b: rgb.b};

});


/** On Client : Set chosen neon ON or OFF */
alt.onClient('seln:mecha:neononoff', (player, neon) => {

    let vehicle = player.vehicle;
    if(neon == 'alloff') { vehicle.neon = { left: false, right: false, front: false, back: false }; }
    else if(neon == 'allon') { vehicle.neon = { left: true, right: true, front: true, back: true }; }
    else { 
        let neons = vehicle.neon
        neons[neon] = !neons[neon];
        vehicle.neon = neons;
     }

});



/**
 * On Client : Set Mod
 *      If the mod is 'tint' set window tint to given number
 *      If the mod is 'wheels' set the two wheels mod to given number
 *      If not one of those two then set the given mod to the given number
 */
alt.onClient('seln:mecha:setmod', (player, mod, num) => {

    let vehicle = player.vehicle;
    if( mod == 'tint' ) { vehicle.windowTint = num; }
    else if( mod == 'wheels' ) { 
        vehicle.setMod(23, num); 
        vehicle.setMod(24, num);
    }
    else { vehicle.setMod(mod, num); }

});



/**
 * On Client : Switch Mod
 *      Switch the mod between ON / OFF
 */
alt.onClient('seln:mecha:switchmod', (player, mod) => {

    let vehicle = player.vehicle;
    let actual = vehicle.getMod(mod);
    let switcher = !actual
    vehicle.setMod(mod, switcher);

});



/**
 * On Client : Change Plate
 *      Set the plate model to asked one
 */
alt.onClient('seln:mecha:platechanger', (player, plate) => {

    let vehicle = player.vehicle;
    vehicle.numberPlateIndex = plate; 

});


/**
 * On Client : Xenon Headlights
 *      Activate vehicle's xenon to fix bug #1
 *          Bug #1 : The Colored Headlights get undone when closing the menu
 *      Set the Xenon Headlights to asked color
 */
alt.onClient('seln:mecha:setxenon', (player, xenon) => {

    let vehicle = player.vehicle;
    vehicle.setMod(22, true);
    vehicle.headlightColor = xenon;

});

/**
 * Function : HEX color to RGB color translater
 * 
 * From : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function hexToRgb(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}