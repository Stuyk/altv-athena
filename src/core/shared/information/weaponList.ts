export interface Weapon {
    hash: number;
    name: string;
    desc?: string;
    type?: string;
    price?: number;
    clip?: number;
    stats?: {
        damage?: number;
        rate?: number;
        accuracy?: number;
        range?: number;
    };
    overall?: number;
}

const WeaponList: { [key: string]: Weapon } = {
    advancedrifle: {
        hash: 0xaf113f99,
        name: 'Advanced Rifle',
        desc: 'The most lightweight and compact of all assault rifles, without compromising accuracy and rate of fire.',
        type: 'Assault Rifle',
        price: 14250,
        clip: 30,
        stats: {
            damage: 24,
            rate: 70,
            accuracy: 50,
            range: 45
        },
        overall: 47.8
    },
    appistol: {
        hash: 0x22d8fe39,
        name: 'AP Pistol',
        desc:
            'High-penetration, fully-automatic pistol. Holds 18 rounds in magazine with option to extend to 36 rounds.',
        type: 'Handgun',
        price: 5000,
        clip: 18,
        stats: {
            damage: 26,
            rate: 80,
            accuracy: 35,
            range: 30
        },
        overall: 38.2
    },
    assaultrifle: {
        hash: 0xbfefff6d,
        name: 'Assault Rifle',
        desc: 'This standard assault rifle boasts a large capacity magazine and long distance accuracy.',
        type: 'Assault Rifle',
        price: 8550,
        clip: 30,
        stats: {
            damage: 30,
            rate: 60,
            accuracy: 45,
            range: 45
        },
        overall: 44
    },
    assaultriflemk2: {
        hash: 0x394f415c,
        name: 'Assault Rifle MK II',
        desc:
            'The definitive revision of an all-time classic: all it takes is a little work, and looks can kill after all.',
        type: 'Assault Rifle',
        price: 98750,
        clip: 30,
        stats: {
            damage: 33,
            rate: 60,
            accuracy: 45,
            range: 45
        },
        overall: 44.6
    },
    assaultshotgun: {
        hash: 0xe284c527,
        name: 'Assault Shotgun',
        desc: 'Fully automatic shotgun with 8 round magazine and high rate of fire.',
        type: 'Shotgun',
        price: 10000,
        clip: 8,
        stats: {
            damage: 77,
            rate: 50,
            accuracy: 25,
            range: 15
        },
        overall: 35.4
    },
    assaultsmg: {
        hash: 0xefe7e2df,
        name: 'Assault SMG',
        desc:
            'A high-capacity submachine gun that is both compact and lightweight. Holds up to 30 bullets in one magazine.',
        type: 'Machine Gun',
        price: 12550,
        clip: 30,
        stats: {
            damage: 23,
            rate: 55,
            accuracy: 45,
            range: 40
        },
        overall: 40.6
    },
    autoshotgun: {
        hash: 0x12e82d3d,
        name: 'Auto Shotgun',
        desc: 'Fully automatic shotgun with 8 round magazine and high rate of fire.',
        type: 'Shotgun',
        price: 10000,
        clip: 8,
        stats: {
            damage: 77,
            rate: 50,
            accuracy: 25,
            range: 15
        },
        overall: 35.4
    },
    ball: {
        hash: 0x23c9f95c,
        name: 'Baseball',
        desc: `Come and get ya hotdog $5!`,
        type: 'Thrown',
        price: 10,
        clip: 1,
        stats: {
            damage: 0,
            rate: 10,
            accuracy: 10,
            range: 0
        },
        overall: 5
    },
    bat: {
        hash: 0x958a4a8f,
        name: 'Baseball Bat',
        desc: 'Aluminum baseball bat with leather grip. Lightweight yet powerful for all you big hitters out there.',
        type: 'Melee',
        price: 100,
        stats: {
            damage: 20,
            rate: 10,
            range: 1
        },
        overall: 10.33
    },
    battleaxe: {
        hash: 0xcd274149,
        name: 'Battle Axe',
        desc: `If it's good enough for medieval foot soldiers, modern border guards and pushy soccer moms, it's good enough for you.`,
        type: 'Melee',
        price: 300,
        stats: {
            damage: 15,
            rate: 15,
            range: 0
        },
        overall: 10
    },
    bottle: {
        hash: 0xf9e6aa4b,
        name: 'Broken Bottle',
        desc: `It's not clever and it's not pretty but, most of the time, neither is the guy coming at you with a knife. When all else fails, this gets the job done.`,
        type: 'Melee',
        price: 8,
        stats: {
            damage: 20,
            rate: 15,
            range: 1
        },
        overall: 12
    },
    bullpuprifle: {
        hash: 0x7f229f94,
        name: 'Bullpup Rifle',
        desc: `The latest Chinese import taking America by storm, this rifle is known for its balanced handling. Lightweight and very controllable in automatic fire.`,
        type: 'Assault Rifle',
        price: 14500,
        clip: 30,
        stats: {
            damage: 32,
            rate: 70,
            accuracy: 45,
            range: 45
        },
        overall: 46
    },
    bullpupriflemk2: {
        hash: 0x84d6fafd,
        name: 'Bullpup Rifle MK II',
        desc: `So precise, so exquisite, it's not so much a hail of bullets as a symphony.`,
        type: 'Assault Rifle',
        price: 14500,
        clip: 30,
        stats: {
            damage: 35,
            rate: 72,
            accuracy: 45,
            range: 45
        },
        overall: 47.4
    },
    bullpupshotgun: {
        hash: 0x9d61e50f,
        name: 'Bullpup Shotgun',
        desc: `More than makes up for its slow, pump-action rate of fire with its range and spread. Decimates anything in its projectile path.`,
        type: 'Shotgun',
        price: 8000,
        clip: 14,
        stats: {
            damage: 67,
            rate: 20,
            accuracy: 30,
            range: 20
        },
        overall: 31.4
    },
    bzgas: {
        hash: 0xa0973d5e,
        name: 'Tear Gas',
        desc: `Tear gas grenade, particularly effective at incapacitating multiple assailants. Sustained exposure can be lethal.`,
        type: 'Thrown',
        price: 150,
        clip: 25,
        stats: {
            damage: 10,
            rate: 20,
            accuracy: 10,
            range: 15
        },
        overall: 13.75
    },
    carbinerifle: {
        hash: 0x83bf0278,
        name: 'Carbine Rifle',
        desc:
            'Combining long distance accuracy with a high capacity magazine, the Carbine Rifle can be relied on to make the hit.',
        type: 'Assault Rifle',
        price: 13000,
        clip: 30,
        stats: {
            damage: 32,
            rate: 65,
            accuracy: 55,
            range: 45
        },
        overall: 47.4
    },
    carbineriflemk2: {
        hash: 0xfad1f1c9,
        name: 'Carbine Rifle MK II',
        desc: `This is bespoke, artisan firepower: you couldn't deliver a hail of bullets with more love and care if you inserted them by hand.`,
        type: 'Assault Rifle',
        price: 107500,
        clip: 30,
        stats: {
            damage: 36,
            rate: 65,
            accuracy: 55,
            range: 45
        },
        overall: 48.2
    },
    ceramicpistol: {
        hash: 0x2b5ef5ec,
        name: 'Ceramic Pistol',
        desc: `Not your grandma's ceramics. Although this pint-sized pistol is small enough to fit into her purse and won't set off a metal detector.`,
        type: 'Handgun',
        price: 20000,
        clip: 12,
        stats: {
            damage: 32,
            rate: 44,
            accuracy: 36,
            range: 20
        },
        overall: 27.6
    },
    combatmg: {
        hash: 0x7fd62962,
        name: 'Combat MG',
        desc: `Lightweight, compact machine gun that combines excellent maneuverability with a high rate of fire to devastating effect.`,
        type: 'Machine Gun',
        price: 14800,
        clip: 100,
        stats: {
            damage: 55,
            rate: 65,
            accuracy: 45,
            range: 60
        },
        overall: 59
    },
    combatmgmk2: {
        hash: 0xdbbd7280,
        name: 'Combat MG MKII',
        desc: `You can never have too much of a good thing: after all, if the first shot counts, then the next hundred or so must count for double.`,
        type: 'Machine Gun',
        price: 119000,
        clip: 100,
        stats: {
            damage: 57,
            rate: 65,
            accuracy: 45,
            range: 60
        },
        overall: 59.4
    },
    combatpdw: {
        hash: 0xa3d4d34,
        name: 'Combat PDW',
        desc: `Who said personal weaponry couldn't be worthy of military personnel? Thanks to our lobbyists, not Congress. Integral suppressor.`,
        type: 'Machine Gun',
        price: 11750,
        clip: 30,
        stats: {
            damage: 25,
            rate: 50,
            accuracy: 45,
            range: 38
        },
        overall: 39.6
    },
    combatpistol: {
        hash: 0x5ef9fec4,
        name: 'Combat Pistol',
        desc: `A compact, lightweight semi-automatic pistol designed for law enforcement and personal defense use. 12-round magazine with option to extend to 16 rounds.`,
        type: 'Handgun',
        price: 3200,
        clip: 12,
        stats: {
            damage: 27,
            rate: 40,
            accuracy: 50,
            range: 30
        },
        overall: 31.4
    },
    compactlauncher: {
        hash: 0x781fe4a,
        name: 'Compact Grenade Launcher',
        desc: `Focus groups using the regular model suggested it was too accurate and found it awkward to use with one hand on the throttle. Easy fix.`,
        type: `Heavy Weapon`,
        price: 45000,
        clip: 1,
        stats: {
            damage: 95,
            rate: 10,
            accuracy: 15,
            range: 55
        },
        overall: 39
    },
    compactrifle: {
        hash: 0x624fe830,
        name: 'Compact Rifle',
        desc: `Half the size, all the power, double the recoil: there's no riskier way to say "I'm compensating for something".`,
        type: 'Assault Rifle',
        price: 14650,
        clip: 30,
        stats: {
            damage: 36,
            rate: 60,
            accuracy: 35,
            range: 45
        },
        overall: 43.2
    },
    crowbar: {
        hash: 0x84bd7bfd,
        name: 'Crowbar',
        desc: `Heavy-duty crowbar forged from high quality, tempered steel for that extra leverage you need to get the job done.`,
        type: 'Melee',
        price: 55,
        stats: {
            damage: 10,
            rate: 15,
            range: 1
        },
        overall: 8.67
    },
    dagger: {
        hash: 0x92a27487,
        name: 'Antique Cavalry Dagger',
        desc: `You've been rocking the pirate-chic look for a while, but no vicious weapon to complete the look? Get this dagger with guarded hilt.`,
        type: 'Melee',
        price: 2000,
        stats: {
            damage: 20,
            rate: 20,
            range: 2
        },
        overall: 14
    },
    dbshotgun: {
        hash: 0xef951fbb,
        name: 'Double Barrel Shotgun',
        desc: `Do one thing, do it well. Who needs a high rate of fire when your first shot turns the other guy into a fine mist?`,
        type: 'Shotgun',
        price: 15450,
        clip: 2,
        stats: {
            damage: 98,
            rate: 25,
            accuracy: 15,
            range: 10
        },
        overall: 30
    },
    doubleaction: {
        hash: 0x97ea20b8,
        name: 'Double Action Revolver',
        desc: `Because sometimes revenge is a dish best served six times, in quick succession, right between the eyes.`,
        type: 'Handgun',
        price: 75000,
        clip: 6,
        stats: {
            damage: 70,
            rate: 35,
            accuracy: 65,
            range: 20
        },
        overall: 39.2
    },
    fireextinguisher: {
        hash: 0x60ec506,
        name: 'Fire Extinguisher',
        desc: `Smother the flames of your enemies.`,
        type: 'Utility',
        price: 200,
        clip: 100
    },
    firework: {
        hash: 0x7f7497e5,
        name: 'Firework Launcher',
        desc: `Put the flair back in flare with this firework launcher, guaranteed to raise some oohs and aahs from the crowd.`,
        type: 'Heavy Weapon',
        price: 65000,
        clip: 1,
        stats: {
            damage: 45,
            rate: 5,
            accuracy: 12,
            range: 60
        },
        overall: 26.4
    },
    flare: {
        hash: 0x497facc3,
        name: 'Flare',
        desc: `Signal some assistance.`,
        type: `Thrown`,
        price: 50,
        clip: 1,
        stats: { damage: 0, rate: 10, accuracy: 10, range: 25 },
        overall: 11.25
    },
    flaregun: {
        hash: 0x47757124,
        name: 'Flare Gun',
        desc: `Use to signal distress or drunken excitement. Warning: pointing directly at individuals may cause spontaneous combustion.`,
        type: `Handgun`,
        price: 3750,
        clip: 1,
        stats: {
            damage: 20,
            rate: 10,
            accuracy: 30,
            range: 10
        },
        overall: 16
    },
    flashlight: {
        hash: 0x8bb05fd7,
        name: 'Flashlight',
        desc: `Intensify your fear of the dark with this short range, battery-powered light source. Handy for blunt force trauma.`,
        type: 'Melee',
        price: 250,
        stats: {
            damage: 10,
            rate: 15,
            range: 0
        },
        overall: 8.33
    },
    golfclub: {
        hash: 0x440e4788,
        name: 'Golf Club',
        desc: `Standard length, mid iron golf club with rubber grip for a lethal short game.`,
        type: `Melee`,
        price: 125,
        stats: {
            damage: 20,
            rate: 10,
            range: 1
        },
        overall: 10.33
    },
    grenade: {
        hash: 0x93e220bd,
        name: 'Grenade',
        desc: `Standard fragmentation grenade. Pull pin, throw, then find cover. Ideal for eliminating clustered assailants.`,
        type: `Heavy Weapon`,
        price: 2500,
        clip: 1,
        stats: {
            damage: 95,
            rate: 20,
            accuracy: 10,
            range: 15
        },
        overall: 35
    },
    grenadelauncher: {
        hash: 0xa284510b,
        name: 'Grenade Launcher',
        desc: `A compact, lightweight grenade launcher with semi-automatic functionality. Holds up to 10 rounds.`,
        type: `Heavy Weapon`,
        price: 32400,
        clip: 10,
        stats: {
            damage: 95,
            rate: 20,
            accuracy: 10,
            range: 50
        },
        overall: 39.0
    },
    smokelauncher: {
        hash: 0x4dd2dc56,
        name: 'Smoke Launcher',
        desc: `A compact, lightweight smoke launcher with semi-automatic functionality. Holds up to 10 rounds.`,
        type: `Utility`,
        price: 4200,
        clip: 10
    },
    gusenberg: {
        hash: 0x61012683,
        name: 'Gusenberg Sweeper',
        desc: `Complete your look with a Prohibition gun. Looks great being fired from an Albany Roosevelt or paired with a pinstripe suit.`,
        type: `Machine Gun`,
        price: 14600,
        clip: 30,
        stats: {
            damage: 34,
            rate: 65,
            accuracy: 38,
            range: 56
        },
        overall: 46.6
    },
    hammer: {
        hash: 0x4e875f73,
        name: `Hammer`,
        desc: `A robust, multi-purpose hammer with wooden handle and curved claw, this old classic still nails the competition.`,
        type: `Melee`,
        price: 500,
        stats: {
            damage: 10,
            rate: 15,
            range: 1
        },
        overall: 8.67
    },
    hatchet: {
        hash: 0xf9dcbf2d,
        name: 'Hatchet',
        desc: `Add a good old-fashioned hatchet to your armory, and always have a back up for when ammo is hard to come by.`,
        type: `Melee`,
        price: 750,
        stats: {
            damage: 15,
            rate: 15,
            range: 0
        },
        overall: 10
    },
    hazardcan: {
        hash: 0xba536372,
        name: 'Hazard Can',
        desc: `No idea what this is.`,
        type: `Thrown`,
        price: 100,
        clip: 100,
        stats: {
            damage: 0,
            rate: 10,
            accuracy: 30,
            range: 1
        },
        overall: 24.2
    },
    heavypistol: {
        hash: 0xd205520e,
        name: 'Heavy Pistol',
        desc: `The heavyweight champion of the magazine fed, semi-automatic handgun world. Delivers accuracy and a serious forearm workout every time.`,
        type: `Handgun`,
        price: 3750,
        clip: 18,
        stats: { damage: 40, rate: 40, accuracy: 50, range: 35 },
        overall: 37
    },
    heavyshotgun: {
        hash: 0x3aabbbaa,
        name: 'Heavy Shotgun',
        desc: `The weapon to reach for when you absolutely need to make a horrible mess of the room. Best used near easy-wipe surfaces only.`,
        type: `Shotgun`,
        price: 13550,
        clip: 6,
        stats: { damage: 85, rate: 45, accuracy: 30, range: 25 },
        overall: 38.6
    },
    heavysniper: {
        hash: 0xc472fe2,
        name: `Heavy Sniper`,
        desc: `Features armor-piercing rounds for heavy damage. Comes with laser scope as standard.`,
        type: `Sniper Rifle`,
        price: 38150,
        clip: 6,
        stats: {
            damage: 98,
            rate: 20,
            accuracy: 90,
            range: 100
        },
        overall: 62.6
    },
    heavysnipermk2: {
        hash: 0xa914799,
        name: 'Heavy Sniper MK II',
        desc: `Far away, yet always intimate: if you're looking for a secure foundation for that long-distance relationship, this is it.`,
        type: `Sniper Rifle`,
        price: 165375,
        clip: 6,
        stats: {
            damage: 98,
            rate: 20,
            accuracy: 90,
            range: 100
        },
        overall: 62.6
    },
    hominglauncher: {
        hash: 0x63ab0442,
        name: 'Homing Launcher',
        desc: `Infrared guided fire-and-forget missile launcher. For all your moving target needs.`,
        type: `Heavy Weapon`,
        price: 165000,
        clip: 1,
        stats: {
            damage: 95,
            rate: 5,
            accuracy: 25,
            range: 75
        },
        overall: 42
    },
    knife: {
        hash: 0x99b507ea,
        name: 'Knife',
        desc: `This carbon steel 7" bladed knife is dual edged with a serrated spine to provide improved stabbing and thrusting capabilities.`,
        type: `Melee`,
        price: 400,
        stats: {
            damage: 15,
            rate: 20,
            range: 1
        },
        overall: 12
    },
    knuckle: {
        hash: 0xd8df3c3c,
        name: 'Knuckle Dusters',
        desc: `Perfect for knocking out gold teeth, or as a gift to the trophy partner who has everything.`,
        type: `Melee`,
        price: 7500,
        stats: {
            damage: 10,
            rate: 20,
            range: 1
        },
        overall: 1
    },
    machete: {
        hash: 0xdd5df8d9,
        name: 'Machete',
        desc: `America's West African arms trade isn't just about giving. Rediscover the simple life with this rusty cleaver.`,
        type: `Melee`,
        price: 8900,
        stats: {
            damage: 15,
            rate: 15,
            range: 0
        },
        overall: 10
    },
    machinepistol: {
        hash: 0xdb1aa450,
        name: 'Machine Pistol',
        desc: `This fully automatic is the snare drum to your twin-engine V8 bass: no drive-by sounds quite right without it.`,
        type: `Machine Gun`,
        price: 6250,
        clip: 12,
        stats: {
            damage: 28,
            rate: 70,
            accuracy: 40,
            range: 30
        },
        overall: 36
    },
    marksmanpistol: {
        hash: 0xdc4db296,
        name: 'Marksman Pistol',
        desc: `Not for the risk averse. Make it count as you'll be reloading as much as you shoot.`,
        type: `Handgun`,
        price: 4350,
        clip: 1,
        stats: {
            damage: 80,
            rate: 15,
            accuracy: 30,
            range: 35
        },
        overall: 32.4
    },
    marksmanrifle: {
        hash: 0xc734385a,
        name: 'Marksman Rifle',
        desc: `Whether you're up close or a disconcertingly long way away, this weapon will get the job done. A multi-range tool for tools.`,
        type: `Sniper Rifle`,
        price: 15750,
        clip: 8,
        stats: {
            damage: 70,
            rate: 40,
            accuracy: 80,
            range: 90
        },
        overall: 58
    },
    marksmanriflemk2: {
        hash: 0x6a6c02e0,
        name: 'Marksman Rifle MK II',
        desc: `Known in military circles as The Dislocator, this mod set will destroy both the target and your shoulder, in that order.`,
        type: `Sniper Rifle`,
        price: 149000,
        clip: 8,
        stats: {
            damage: 70,
            rate: 40,
            accuracy: 80,
            range: 90
        },
        overall: 58
    },
    mg: {
        hash: 0x9d07f764,
        name: 'MG',
        desc: `General purpose machine gun that combines rugged design with dependable performance. Long range penetrative power. Very effective against large groups.`,
        type: `Machine Gun`,
        price: 13500,
        clip: 54,
        stats: {
            damage: 50,
            rate: 60,
            accuracy: 40,
            range: 60
        },
        overall: 52
    },
    microsmg: {
        hash: 0x13532244,
        name: `Micro SMG`,
        desc: `Combines compact design with a high rate of fire at approximately 700-900 rounds per minute.`,
        type: `Machine Gun`,
        price: 3750,
        clip: 16,
        stats: {
            damage: 21,
            rate: 60,
            accuracy: 30,
            range: 25
        },
        overall: 31.2
    },
    minigun: {
        hash: 0x42bf8a85,
        name: 'Minigun',
        desc: `A devastating 6-barrel machine gun that features Gatling-style rotating barrels. Very high rate of fire (2000 to 6000 rounds per minute).`,
        type: `Heavy Weapon`,
        price: 470000,
        clip: 595,
        stats: {
            damage: 30,
            rate: 100,
            accuracy: 40,
            range: 55
        },
        overall: 63
    },
    minismg: {
        hash: 0xbd248b55,
        name: `Mini SMG`,
        desc: `Increasingly popular since the marketing team looked beyond spec ops units and started caring about the little guys in low income areas.`,
        type: `Machine Gun`,
        price: 8900,
        clip: 20,
        stats: {
            damage: 22,
            rate: 84,
            accuracy: 33,
            range: 30
        },
        overall: 36.2
    },
    molotov: {
        hash: 0x24b17070,
        name: 'Molotov',
        desc: `Crude yet highly effective incendiary weapon. No happy hour with this cocktail.`,
        type: `Thrown`,
        price: 200,
        clip: 1,
        stats: {
            damage: 50,
            rate: 20,
            accuracy: 20,
            range: 8
        },
        overall: 24.5
    },
    musket: {
        hash: 0xa89cb99e,
        name: `Musket`,
        desc: `Armed with nothing but muskets and a superiority complex, the Brits took over half the world. Own the gun that built an Empire.`,
        type: `Shotgun`,
        price: 21400,
        clip: 1,
        stats: {
            damage: 97,
            rate: 10,
            accuracy: 65,
            range: 85
        },
        overall: 53.4
    },
    navyrevolver: {
        hash: 0x917f6c8c,
        name: 'Navy Revolver',
        desc: `A true museum piece. You want to know how the West was won - slow reload speeds and a whole heap of bloodshed.`,
        type: `Handgun`,
        price: 55000,
        stats: {
            damage: 70,
            rate: 25,
            accuracy: 60,
            range: 35
        },
        overall: 40
    },
    nightstick: {
        hash: 0x678b81b1,
        name: 'Nightstick',
        desc: `24" polycarbonate side-handled nightstick.`,
        type: `Melee`,
        price: 400,
        stats: { damage: 10, rate: 15, range: 1 },
        overall: 8.67
    },
    parachute: {
        hash: 0xfbab5776,
        name: 'Parachute',
        desc: `Suicidal tendencies interrupted by parachuttal tendencies.`,
        type: `Utility`,
        price: 250
    },
    jerrycan: {
        hash: 0x34a67b97,
        name: 'Jerry Can',
        desc: `Leaves a trail of gasoline that can be ignited.`,
        type: `Thrown`,
        price: 100,
        clip: 100,
        stats: {
            damage: 0,
            rate: 10,
            accuracy: 30,
            range: 1
        },
        overall: 24.2
    },
    pipebomb: {
        hash: 0xba45e8b8,
        name: 'Pipebomb',
        desc: `Remember, it doesn't count as an IED when you buy it in a store and use it in a first world country.`,
        type: `Heavy Weapon`,
        price: 50000,
        clip: 10,
        stats: {
            damage: 85,
            rate: 10,
            accuracy: 35,
            range: 15
        },
        overall: 36.25
    },
    pipewrench: {
        hash: 0x19044ee0,
        name: 'Pipe Wrench',
        desc: `Perennial favourite of apocalyptic survivalists and violent fathers the world over, apparently it also doubles as some kind of tool.`,
        type: `Melee`,
        price: 7150,
        stats: {
            damage: 10,
            rate: 15,
            range: 0
        },
        overall: 8.33
    },
    pistol: {
        hash: 0x1b06d571,
        name: 'Pistol',
        desc: `Standard handgun. A .45 caliber combat pistol with a magazine capacity of 12 rounds that can be extended to 16.`,
        type: `Handgun`,
        price: 2500,
        clip: 12,
        stats: {
            damage: 26,
            rate: 40,
            accuracy: 40,
            range: 25
        },
        overall: 28.2
    },
    pistol50: {
        hash: 0x99aeeb3b,
        name: `Pistol .50`,
        desc: `High-impact pistol that delivers immense power but with extremely strong recoil. Holds 9 rounds in magazine.`,
        type: `Handgun`,
        price: 3900,
        clip: 9,
        stats: {
            damage: 51,
            rate: 40,
            accuracy: 55,
            range: 35
        },
        overall: 37.8
    },
    pistolmk2: {
        hash: 0xbfe256d4,
        name: 'Pistol MK II',
        desc: `Balance, simplicity, precision: nothing keeps the peace like an extended barrel in the other guy's mouth.`,
        type: `Handgun`,
        price: 73750,
        clip: 12,
        stats: {
            damage: 38,
            rate: 40,
            accuracy: 40,
            range: 25
        },
        overall: 30.6
    },
    poolcue: {
        hash: 0x94117305,
        name: `Pool Cue`,
        desc: `Ah, there's no sound as satisfying as the crack of a perfect break, especially when it's the other guy's spine.`,
        type: `Melee`,
        price: 6250,
        stats: {
            damage: 20,
            rate: 10,
            range: 0
        },
        overall: 10
    },
    proxmine: {
        hash: 0xab564b93,
        name: `Proximity Mine`,
        desc: `Leave a present for your friends with these motion sensor landmines. Short delay after activation.`,
        type: `Heavy Weapon`,
        price: 1000,
        clip: 5,
        stats: {
            damage: 90,
            rate: 10,
            accuracy: 30,
            range: 20
        },
        overall: 37.5
    },
    pumpshotgun: {
        hash: 0x1d073a89,
        name: `Pump Shotgun`,
        desc: `Standard shotgun ideal for short-range combat. A high-projectile spread makes up for its lower accuracy at long range.`,
        type: `Shotgun`,
        price: 3500,
        clip: 8,
        stats: {
            damage: 67,
            rate: 20,
            accuracy: 30,
            range: 20
        },
        overall: 29.4
    },
    pumpshotgunmk2: {
        hash: 0x555af99a,
        name: `Pump Shotgun MK II`,
        desc: `Only one thing pumps more action than a pump action: watch out, the recoil is almost as deadly as the shot.`,
        type: `Shotgun`,
        price: 82500,
        clip: 8,
        stats: {
            damage: 67,
            rate: 20,
            accuracy: 30,
            range: 20
        },
        overall: 29.4
    },
    railgun: {
        hash: 0x6d544c99,
        name: 'Railgun',
        desc: `Fully-automatic, battery-powered gun, perfect for those looking for a more unusual yet highly-lethal weapon.`,
        type: `Heavy Weapon`,
        price: 250000,
        clip: 20,
        stats: {
            damage: 90,
            rate: 25,
            accuracy: 20,
            range: 70
        },
        overall: 44
    },
    raycarbine: {
        hash: 0x476bf155,
        name: 'Unholy Hellbringer',
        desc: `Republican Space Ranger Special. If you want to turn a little green man into little green goo, this is the only American way to do it.`,
        type: `Machine Gun`,
        price: 449000,
        clip: 9999,
        stats: {
            damage: 55,
            rate: 65,
            accuracy: 45,
            range: 60
        },
        overall: 59
    },
    rayminigun: {
        hash: 0xb62d1f67,
        name: 'Widowmaker',
        desc: `A futuristic Minigun. Republican Space Ranger Special. GO AHEAD, SAY I'M COMPENSATING FOR SOMETHING. I DARE YOU.`,
        type: `Heavy Weapon`,
        price: 449000,
        clip: 9999,
        stats: {
            damage: 30,
            rate: 100,
            accuracy: 40,
            range: 55
        },
        overall: 63
    },
    raypistol: {
        hash: 0xaf3696a1,
        name: `Up-n-Atomizer`,
        desc: `A futuristic alien pistol, also known as Raygun. Republican Space Ranger Special, fresh from the galactic war on socialism: no ammo, no mag, just one brutal energy pulse after another.`,
        type: `Handgun`,
        price: 399000,
        clip: 9999,
        stats: {
            damage: 80,
            rate: 10,
            accuracy: 10,
            range: 50
        },
        overall: 32
    },
    revolver: {
        hash: 0xc1b3c3d1,
        name: 'Heavy Revolver',
        desc: `A handgun with enough stopping power to drop a crazed rhino, and heavy enough to beat it to death if you're out of ammo.`,
        type: `Handgun`,
        price: 5900,
        clip: 6,
        stats: {
            damage: 70,
            rate: 20,
            accuracy: 65,
            range: 35
        },
        overall: 39.2
    },
    revolvermk2: {
        hash: 0xcb96392f,
        name: 'Heavy Revolver MK II',
        desc: `A handgun with enough stopping power to drop a crazed rhino, and heavy enough to beat it to death if you're out of ammo.`,
        type: `Handgun`,
        price: 99000,
        clip: 6,
        stats: {
            damage: 75,
            rate: 30,
            accuracy: 65,
            range: 35
        },
        overall: 42.2
    },
    rpg: {
        hash: 0xb1ca77b1,
        name: 'RPG',
        desc: `A portable, shoulder-launched, anti-tank weapon that fires explosive warheads. Very effective for taking down vehicles or large groups of assailants.`,
        type: `Heavy Weapon`,
        price: 26250,
        clip: 1,
        stats: {
            damage: 100,
            rate: 5,
            accuracy: 10,
            range: 70
        },
        overall: 39
    },
    sawnoffshotgun: {
        hash: 0x7846a318,
        name: 'Sawed-Off Shotgun',
        desc: `This single-barrel, sawed-off shotgun compensates for its low range and ammo capacity with devastating efficiency in close combat.`,
        type: `Shotgun`,
        price: 30000,
        clip: 8,
        stats: {
            damage: 96,
            rate: 20,
            accuracy: 20,
            range: 15
        },
        overall: 32.2
    },
    smg: {
        hash: 0x2be6766b,
        name: `SMG`,
        desc: `This is known as a good all-around submachine gun. Lightweight with an accurate sight and 30-round magazine capacity.`,
        type: `Machine Gun`,
        price: 7500,
        clip: 30,
        stats: {
            damage: 22,
            rate: 55,
            accuracy: 40,
            range: 35
        },
        overall: 38.4
    },
    smgmk2: {
        hash: 0x78a97cd0,
        name: `SMG MK II`,
        desc: `Lightweight, compact, with a rate of fire to die very messily for: turn any confined space into a kill box at the click of a well-oiled trigger.`,
        type: `Machine Gun`,
        price: 85500,
        clip: 30,
        stats: {
            damage: 22,
            rate: 55,
            accuracy: 40,
            range: 35
        },
        overall: 38.4
    },
    smokegrenade: { hash: 0xfdbc8a50, name: 'Smoke Grenade', desc: `Smoookiinnnn...`, type: `Thrown`, price: 800 },
    sniperrifle: {
        hash: 0x5fc3c11,
        name: `Sniper Rifle`,
        desc: `Standard sniper rifle. Ideal for situations that require accuracy at long range. Limitations include slow reload speed and very low rate of fire.`,
        type: `Sniper Rifle`,
        price: 20000,
        clip: 10,
        stats: {
            damage: 96,
            rate: 25,
            accuracy: 70,
            range: 95
        },
        overall: 59.2
    },
    snowball: {
        hash: 0x787f0bb,
        name: 'Snowball',
        desc: `Be on the lookout and ready to round up your Crew for a friendly snowball fight, but be forewarned, those icy little suckers can pack a wallop`,
        type: `Thrown`,
        price: 5,
        clip: 9,
        stats: {
            damage: 1,
            rate: 10,
            accuracy: 10,
            range: 0
        },
        overall: 5.25
    },
    snspistol: {
        hash: 0xbfd21232,
        name: `SNS Pistol`,
        desc: `Like condoms or hairspray, this fits in your pocket for a night on the town. The price of a bottle at a club, it's half as accurate as a champagne cork, and twice as deadly.`,
        type: `Handgun`,
        price: 2750,
        clip: 6,
        stats: {
            damage: 30,
            rate: 40,
            accuracy: 40,
            range: 20
        },
        overall: 26.6
    },
    snspistolmk2: {
        hash: 0x88374054,
        name: `SNS Pistol MK II`,
        desc: `The ultimate purse-filler: if you want to make Saturday Night really special, this is your ticket.`,
        type: `Handgun`,
        price: 79575,
        clip: 6,
        stats: {
            damage: 30,
            rate: 40,
            accuracy: 40,
            range: 20
        },
        overall: 26.6
    },
    specialcarbine: {
        hash: 0xc0a3098d,
        name: `Special Carbine`,
        desc: `Combining accuracy, maneuverability, firepower and low recoil, this is an extremely versatile assault rifle for any combat situation.`,
        type: `Assault Rifle`,
        price: 14750,
        clip: 30,
        stats: {
            damage: 34,
            rate: 65,
            accuracy: 55,
            range: 40
        },
        overall: 46.8
    },
    specialcarbinemk2: {
        hash: 0x969c3d67,
        name: `Special Carbine MK II`,
        desc: `The jack of all trades just got a serious upgrade: bow to the master.`,
        type: `Assault Rifle`,
        price: 135000,
        clip: 30,
        stats: {
            damage: 34,
            rate: 65,
            accuracy: 55,
            range: 40
        },
        overall: 46.8
    },
    stickybomb: {
        hash: 0x2c3731d9,
        name: `Sticky Bomb`,
        desc: `A plastic explosive charge fitted with a remote detonator. Can be thrown and then detonated or attached to a vehicle then detonated.`,
        type: `Thrown`,
        price: 60000,
        clip: 25,
        stats: { damage: 95, rate: 10, accuracy: 30, range: 10 },
        overall: 36.25
    },
    stonehatchet: {
        hash: 0x3813fc08,
        name: 'Stone Hatchet',
        desc: `Stone cold killer.`,
        type: `Melee`,
        price: 25000,
        stats: { damage: 30, rate: 15, range: 0 },
        overall: 15
    },
    stungun: {
        hash: 0x3656c8c1,
        name: 'Stun Gun',
        desc: `Fires a projectile that administers a voltage capable of temporarily stunning an assailant. Takes approximately 4 seconds to recharge after firing.`,
        type: `Handgun`,
        price: 100,
        stats: { damage: 1, rate: 10, accuracy: 40, range: 5 },
        overall: 31.2
    },
    switchblade: {
        hash: 0xdfe37640,
        name: `Switch Blade`,
        desc: `From your pocket to hilt-deep in the other guy's ribs in under a second: folding knives will never go out of style.`,
        type: `Melee`,
        price: 1950,
        stats: { damage: 15, rate: 20, range: 0 },
        overall: 11.67
    },
    unarmed: {
        hash: 0xa2719263,
        name: 'unarmed'
    },
    vintagepistol: {
        hash: 0x83839c4,
        name: `Vintage Pistol`,
        desc: `What you really need is a more recognisable gun. Stand out from the crowd at an armed robbery with this engraved pistol.`,
        type: `Handgun`,
        price: 3450,
        stats: { damage: 35, rate: 40, accuracy: 40, range: 25 },
        overall: 29.2
    }
};

/**
 * Get a weapon hash by its string name.
 * @export
 * @param {string} name
 * @return {*}  {(number | null)}
 */
export function getWeaponByName(name: string): Weapon | null {
    return WeaponList[name];
}
