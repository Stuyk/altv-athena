/** Imports of natives and of the incredible functions of ALTV */
import * as alt from 'alt';
import * as native from 'natives';



/**
 * List of variables :
 * 
 * vehicle : ScriptID of the vehicle that is actually being customised in menu
 * menuouvert : Is menuopen used for on.keydown to avoid opening it while open
 * portesouvertes : Are vehicle's doors open ? used for doors bonus button
 * enginestate : Is vehicle's engine on ? used for engine bonus button
 * interval : No Mouse & Debugging Interval ( Only active when in menu )
 * wtype : For Debugging ( #2 )
 * wtype : For Debugging ( #2 )
 * roof : For Debugging ( #4 )
 * actualextra : For Debugging ( #5 )
 * 
 */
let vehicle = false;
let menuouvert = false;
let portesouvertes = false;
let enginestate = true;
let interval;
let wtype;
let wnum;
let roof;
let actualextra = [];



/**
 *  Listing zone from where menu can be open
 * 
 *  x, y and z are coordinates
 *  dist is the size of the zone in which you can open the menu
 *  name is the name of the blip
 */
let MechanicPosList = [ 
    {   x : -146.6,       y : -596.6,     z : 166.0,   dist : 6.0, name : 'Mechanic'  }, // Arcadius
    {   x : -337.38,      y : -136.92,    z : 38.57,   dist : 6.0, name : 'Mechanic'  }, // burton
    {   x : -1155.53,     y : -2007.18,   z : 12.74,   dist : 6.0, name : 'Mechanic'  }, // airport
    {   x : 731.81,       y : -1088.82,   z : 21.73,   dist : 6.0, name : 'Mechanic'  }, // la mesa
    {   x : 1175.04,      y : 2640.21,    z : 37.32,   dist : 6.0, name : 'Mechanic'  }, // harmony desert
    {   x : 110.99,       y : 6626.39,    z : 30.89,   dist : 6.0, name : 'Mechanic'  }, // paleto bay
    {   x : -375.15,      y : -119.63,    z : 39.17,   dist : 6.0, name : 'Mechanic'  }, // LSC Draußen
    {   x : 806.25,       y : -270.53,    z : 66.27,   dist : 3.0, name : 'Tuning'    }, // Spawnpunkt                                                                        }, // Spawnpunkt

]



/**
 *  Blip Generator
 * 
 *  Srite is the logo on map 
 *  ShortRange is how it is seen on map / radar 
 *      1 mean it will be seen on map and on radar if nearby enough but not pined 
 */
MechanicPosList.forEach(b => {

    const blip = new alt.PointBlip(b.x, b.y, b.z);
        blip.sprite     = 72;
        blip.color      = 28;
        blip.scale      = 1.0;
        blip.shortRange = 1;
        blip.name       = b.name;
        
});



/**
 *  Creation of the WebView Item
 */
let hud = new alt.WebView('http://resource/menu/index.html');



/**
 *  On WebView : Choice of Colors :
 *      Choice of Primary Color
 *      Choice of Secondary Color
 *      Choice of Interior / Third Color
 *      Choice of Pearlescent Color
 *      Choice of Wheel Color
 */
hud.on('ColorHandler', (type, couleur) => { 
    alt.emitServer('seln:mecha:color', type, couleur);  
});



/**
 *  On WebView : Stickers
 *  On WebView : Liveries ( Emergency Vehicles Stickers )
 *  On WebView : Roof Liveries
 */
hud.on('StickerHandler', (sticker) => { alt.emitServer('seln:mecha:setmod', 48, sticker); });
hud.on('LiveryHandler', (livery) => { native.setVehicleLivery(vehicle, livery); });
hud.on('RoofHandler', (livery) => { 
    roof = livery;
    native.setVehicleRoofLivery(vehicle, livery); 
});



/**
 *  On WebView : Choice of which sides are ON or OFF
 *  On WebView : Choice of Neons Color
 */
hud.on('NeonHandler', (hex) => { alt.emitServer('seln:mecha:neon', hex); });
hud.on('NeonONOFFHandler', (neon) => {  alt.emitServer('seln:mecha:neononoff', neon); });



/**
 *  On WebView : Choice of Headlights Xenon Color
 */
hud.on('Xenon', (couleur) => { 
    alt.emitServer('seln:mecha:setxenon', couleur); 
});



/**
 *  On WebView : Setting chosen mod at chosen number
 *  On WebView : Switching chosen mod between TRUE/FALSE ( may not be used )
 */
hud.on('SwitchMod', (mod) => { alt.emitServer('seln:mecha:switchmod', mod); });
hud.on('SetMod', (mod, num) => { alt.emitServer('seln:mecha:setmod', mod, num); });



/**
 *  On WebView : Choice of Plate Format
 */
hud.on('PlateChanger', (plate) => { alt.emitServer('seln:mecha:platechanger', plate); });



/**
 *  On WebView : Choice of Wheels Category :
 *      Set the wheels on the first wheels of the category so the category change it is effective
 *          ( Set the frontwheels and backwheels cause bikes and some vehicles have backwheels )
 *      Saving the wheels category in 'wtype' for the debugging interval
 *      Sending the maximum of wheels for this category to the WebView
 */
hud.on('SetWheelsCat', (cat) => {  
    alt.log(cat);

    native.setVehicleWheelType(vehicle, cat);
    native.setVehicleMod(vehicle, 23, 0);
    native.setVehicleMod(vehicle, 24, 0);

    wtype = native.getVehicleWheelType(vehicle);

    hud.emit('senddata', 'slidermax', native.getNumVehicleMods(vehicle, 23))


});



/**
 *  On WebView : Choice of Wheels :
 *      Set the wheels on asked number
 *          ( Set the frontwheels and backwheels cause bikes and some vehicles have backwheels )
 *      Saving the wheels category in 'wtype' for the debugging interval
 *      Saving the wheels number in 'wnum' for the debugging interval
 */
hud.on('SetWheels', (num) => {  

    native.setVehicleMod(vehicle, 23, num);
    native.setVehicleMod(vehicle, 24, num);

    wtype = native.getVehicleWheelType(vehicle);
    wnum = native.getVehicleMod(vehicle, 23);

});



/**
 *  On WebView : Switching Extras
 *      Get the actual status of the extra and switch it
 *      Saving the chosen extra status in 'actualextra' for the debugging interval
 */
hud.on('Extras', (extra) => { 

    let actual = native.isVehicleExtraTurnedOn(alt.Player.local.vehicle.scriptID, extra);
    if (actual) { native.setVehicleExtra(alt.Player.local.vehicle.scriptID, extra, 1); } 
    else { native.setVehicleExtra(alt.Player.local.vehicle.scriptID, extra, 0); }
    
    actualextra[extra].ison = !actual
});



/**
 *  On WebView : Bonus opening / closing doors
 */
hud.on('BonusPortes', () => {  

    if (portesouvertes) { native.setVehicleDoorsShut(vehicle, false); } 
    else { 
        for (let i = 0; i < 10; i++) { 
            try { native.setVehicleDoorOpen(vehicle, i, false, false); } catch(error) {} 
        }  
    }
    portesouvertes = !portesouvertes
});



/**
 *  On WebView : Bonus repair vehicle
 */
hud.on('BonusRepair', () => { native.setVehicleFixed(vehicle); });



/**
 *  On WebView : Bonus clean vehicle
 */
hud.on('BonusClean', () => { native.setVehicleDirtLevel(vehicle, 0); });



/**
 *  On WebView : Bonus engine OFF / ON
 */
hud.on('BonusMoteur', () => { 
    enginestate = !enginestate
    native.setVehicleEngineOn(vehicle, enginestate, false, true);
});



/**
 *  On WebView : Vision Changes
 */
hud.on('POVHandler', (pov, pov2) => { 
    try {
        native.setGameplayCamRelativeHeading(pov);
        native.setGameplayCamRelativePitch(pov2, 1.00); 
    } catch (error) {}

});



/**
 *  On WebView : Ask for list of stickers with names
 *      If the vehicle have stickers list them with their names
 *      Send the list of names to the WebView
 */
hud.on('AskStickers', (count) => { 

    if(count > 0 ) { 
        let tempstickers = {}
        for (let i = 0; i < count; i++) { 

            let temp = native.getLabelText(native.getModTextLabel( alt.Player.local.vehicle.scriptID, 48, i)); 
            tempstickers[i+1] = { i: i+1, name: temp}
        }
        hud.emit('senddata', 'stickers', tempstickers)
    }
});



/**
 *  On WebView : Ask list of vehicles extras 
 *      Look up if extra 0 to 20 exist for this vehicle
 *      Saving every extras statut in 'actualextra' for the debugging interval
 *      Send to the WebView the existing extras
 *      Send to the WebView if their is at least one extras or not
 */
hud.on('AskExtras', () => { 

    let noextra = true;
    let temp = []
    for (let i = 0; i < 20; i++) { 
        if ( native.doesExtraExist(alt.Player.local.vehicle.scriptID, i) ) 
        { 
            temp[i] = { id: i , state : true } 
            noextra = false   
        } 
        else { temp[i] = { id: i , state : false } }
    }

    temp.forEach(extra => {
        if (extra.state) {
            let ison = native.isVehicleExtraTurnedOn(alt.Player.local.vehicle.scriptID, extra.id)
            actualextra[extra.id] = { id: extra.id, ison: ison };
        } 
    });

    alt.log(noextra);

    hud.emit('senddata', 'extras', temp)
    hud.emit('senddata', 'noextra', noextra)

});



/**
 *  On WebView & Client : Close Menu
 *      Close the WebView
 *      Stopping the no mouse and bug deleter interval
 *      Ask the WebView to set variables to their default values
 */
 hud.on('Close', () => { Close() });
 function Close() {
     menuouvert = false;
 
     native.freezeEntityPosition(vehicle, false); 
     hud.unfocus(); 
     alt.showCursor(false); 
     native.displayRadar(true);
     alt.clearInterval(interval);
 
     vehicle = false;
     hud.emit('close')
}



/**
 *  On Server : Receive data and open menu
 */
alt.onServer('seln:mecha:getmodscountanswer', (type, nblivery, nbroofs, modscount, currentmods) => { 
    hud.emit('ouvrir', type, modscount, currentmods, nblivery, nbroofs) 
});




/**
 * On : KeyDown
 * 
 * [SPACE] key : If player in a vehicle and the menu is closed :
 *      Get position and check if the player is in one of the mechanic zones
 *      If in a mechanic zone, open the menu
 *      
 * [F] key : If the menu is open then close it :
 *      This one is to avoid problems if the player leave the vehicle while in menu
 */
alt.on('keydown', (key) => {

    // [SPACE]
    if ( key == 32 && alt.Player.local.vehicle && menuouvert == false ) { 
        
        let pos = native.getEntityCoords(alt.Player.local.scriptID, true);
        MechanicPosList.forEach(mech => {
            if( native.getDistanceBetweenCoords(mech.x, mech.y, mech.z, pos.x, pos.y, pos.z, true) < mech.dist ) 
                { openMenu('menu') }
        });
    }

    // [F]
    if ( key == 70 && menuouvert == true ) { Close() }
    
});



/**
 *  Menu Opener :
 *      Preparing the needed data to open the menu
 *      Starting the no mouse and bug deleter interval
 *      Asking server for other needed data
 * 
 *      Needed data from client :
 *          Saving the wheel category
 *          Saving the wheel number
 *          Get Number of liveries
 *          Get Number of roof liveries
 */
function openMenu(type) { 

    vehicle = alt.Player.local.vehicle.scriptID

    wtype = native.getVehicleWheelType(vehicle);
    wnum = native.getVehicleMod(vehicle, 23);

    hud.focus(); 
    alt.showCursor(true);
    native.displayRadar(false);
    native.freezeEntityPosition(vehicle, true);

    interval = alt.setInterval(() => {  NoMouseAndBugDeleter() }, 1);

    let nblivery = native.getVehicleLiveryCount(vehicle);
    let nbroofs = native.getVehicleRoofLiveryCount(vehicle);
    alt.emitServer('seln:mecha:getmodscount', type, nblivery, nbroofs);
    menuouvert = true
}



/**
 *  In Menu Interval :
 *      Remove the mouse activities to avoid messing the screen when using the menu
 *      Unbug bugs #2, #4 and #5
 *          Bug #2 : The wheels go to normal when changing something else
 *          Bug #4 : The roof livery go back to classic when changing something else
 *          Bug #5 : The extras changes get undone when changing something else
 * 
 */
function NoMouseAndBugDeleter() {

    // Unbug vehicle wheels 
    native.setVehicleWheelType(vehicle, wtype);
    native.setVehicleMod(vehicle, 23, wnum);
    native.setVehicleMod(vehicle, 24, wnum);

    // Unbug vehicle roof livery
    native.setVehicleRoofLivery(vehicle, roof);

    // Unbug vehicle extras
    actualextra.forEach(extra => {
        if (extra != null) {
            let actual = extra.ison
            if (actual) { native.setVehicleExtra(alt.Player.local.vehicle.scriptID, extra.id, 0); } 
            else { native.setVehicleExtra(alt.Player.local.vehicle.scriptID, extra.id, 1); }
        }
    });


    // No Mouse
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disableControlAction(0, 106, true);
}