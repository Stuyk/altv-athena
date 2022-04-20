
let app = new Vue({ el: '#app', credit: '', data: {

    /**
     *  Languages :
     *      "fr" for french
     *      "en" for english
     *  Translation are changeable in :
     *      "texts"
     *      "couleurs"
     *      "customs"
     *      "couleursxenon"
     *      "platetype"
     */
    lang: 'en', 
    

    /** Variables */
    visible: false,
    visiblecouleur: false,
    visibleroues: false,
    visiblerouescouleur: false,
    visibleneon : false,
    visibleupgrades : false,
    visiblecustoms : false,
    visiblexenonlist : false,
    visibleplate : false,
    visibleextra : false,

    extras : {},
    modscount: {},
    currentmods: {},
    catname: false,
    catupg : 'vide',
    catupgid : 0,
    catwc : -1,
    slidermax : 0,
    slidercurrent : 0,
    alerte : '',
    stickers: 0,
    currentpov : 0,
    currentpov2 : 0,
    noextra : false,


    /** Texts per language */
    texts: {
        en: {
            chrome: 'Chromium',
            metal: 'Metal',
            util: 'Util',
            mate: 'Matte',
            used: 'Used',
            brossed: 'Brushed', 
            ChooseCat: 'Please Choose Category',
            Livery: 'Livery',
            Roof: 'Roof Livery',
            Stickers: 'Sticker',
            NoStickers: 'No Stickers or Livery for this Vehicle',
            NoExtra: 'No Extras',
            color: 'Color',
            Principale: 'Primary',
            Seconde: 'Secondary',
            Interieur: 'Interior',
            Reflets: 'Pearlescent',
            Jantes: 'Wheels',
            xenon: 'Xenon',
            alloff: 'Turn All OFF', allon: 'Turn All ON',
            front: 'Front', back:'Back', left: 'Left', right:'Right',
            WC_Benny: 'Benny\'s Customs',
            WC_Sport: 'Sport',
            WC_Muscles: 'Muscles',
            WC_Low: 'Lowriders',
            WC_SUV: 'SUV',
            WC_4x4: 'All Terrain',
            WC_Tuning: 'Tuning',
            WC_Bikes: 'Bikes',
            WC_HighEnds: 'HighEnds',
        },
        fr: {
            chrome: 'Chrome',
            metal: 'Métal',
            util: 'Utilisé',
            mate: 'Mate',
            used: 'Usé',
            brossed: 'Brossé',
            ChooseCat: 'Choissisez une Categorie',
            Livery: 'Livret ',
            Roof: 'Livret Toit',
            Stickers: 'Sticker',
            NoStickers: 'Aucun Autocollants ou Livery pour ce Véhicule',
            NoExtra: 'Aucun Extras',
            color: 'Couleur',
            Principale: 'Premiere',
            Seconde: 'Secondaire',
            Interieur: 'Interieur',
            Reflets: 'Reflets',
            Jantes: 'Jantes',
            xenon: 'Xenon',
            alloff: 'Tout Eteindre', allon: 'Tout Allumer',
            front: 'Avant', back:'Arriere', left: 'Gauche', right:'Droite',
            WC_Benny: 'Benny\'s Custom',
            WC_Sport: 'Sportives',
            WC_Muscles: 'Mucles',
            WC_Low: 'Lowriders',
            WC_SUV: 'SUV',
            WC_4x4: '4x4',
            WC_Tuning: 'Tuning',
            WC_Bikes: 'Motos',
            WC_HighEnds: 'Haut de Gamme',
        },      
    },
    


    /**
     *  List of the customs
     *      "type" must be unchanged, it's linked to the current mod and mods maxs
     *      "code" must be unchanged, it's linked to ALTV-SERVER Vehicle class
     *      "fr" and "en" can be changed to change the button names
     */
    customs: [
        { type:'tint', fr:'Verre Teinté', en:'Windows Tint', code:'tint' },
        { type:'horns', fr:'Klaxon', en:'Horns', code:14 },
        { type:'exhaust', fr:'Pot d\'Echappement', en:'Exhaust Pipe', code:4 },
        { type:'spoiler', fr:'Aileron', en:'Spoiler', code:0 },
        { type:'fbumper', fr:'Pare-Choc Avant', en:'Front Bumper', code:1 },
        { type:'rbumper', fr:'Pare-Choc Arriere', en:'Rear Bumper', code:2 },
        { type:'sskirt', fr:'Barre Laterale', en:'Side Skirt', code:3 },
        { type:'frame', fr:'Cadre', en:'Frame', code:5 },
        { type:'grille', fr:'Calandre', en:'Grille', code:6 },
        { type:'lwing', fr:'Aile Gauche', en:'Left Wing', code:8 },
        { type:'rwing', fr:'Aile Droite', en:'Right Wing', code:9 },
        { type:'hood', fr:'Capot', en:'Hood', code:7 },
        { type:'roof', fr:'Toit', en:'Roof', code:10 },
        { type:'plateh', fr:'Contour Plaque', en:'Plate Holder', code:25 },
        { type:'platev', fr:'Plaque Pimp', en:'Plate V', code:26 },
        { type:'trimdesign', fr:'Conception', en:'Trim Design', code:27 },
        { type:'ornaments', fr:'Décoration', en:'Ornaments', code:28 },
        { type:'dialdesign', fr:'Cadran', en:'Dial Design', code:30 },
        { type:'doorint', fr:'Interieur Porte', en:'Door Interior', code:31 },
        { type:'seats', fr:'Sieges', en:'Seats', code:32 },
        { type:'steeringw', fr:'Volant', en:'Steering Wheel', code:33 },
        { type:'shiftlever', fr:'Levier de Vitesse', en:'Shift Lever', code:34 },
        { type:'plaques', fr:'Plaques', en:'Plaques', code:35 },
        { type:'hydraulics', fr:'Hydroliques', en:'Hydraulics', code:38 },
        { type:'engineb', fr:'Bloc Moteur', en:'Engine Block', code:39 },
        { type:'airfilter', fr:'Filtre à Air', en:'Air Filtre', code:40 },
        { type:'strutbar', fr:'Barre Structure', en:'Strut Bar', code:41 },
        { type:'archcover', fr:'Arches', en:'Arch Cover', code:42 },
        { type:'antenna', fr:'Antenne', en:'Antenna', code:43 },
        { type:'exteriorp', fr:'Prop Exterieur', en:'Exterior Props', code:44 },
        { type:'tank', fr:'Réservoir', en:'Tank', code:45 },
        { type:'door', fr:'Portes', en:'Doors', code:46 },
        { type:'wroh', fr:'Spécial', en:'Special', code:47 },
        { type:'plate', fr:'Plaque', en:'Plate', code:53 },
        { type:'windowtint', fr:'Fenetre', en:'Windows', code:55 },

    ],



    /**
     *  List of the colors
     *      the ones with "code:..." are invisibles and are used for the littles color button to go faster to a color
     *      "en" and "fr" were done to write the color name but since i'm finally using colored button with type's name they're not used
     *      anymore but i let it here if you want to use it instead of type's name
     */
    couleurs: [


        { code:'grey', 
          id: 120, hex:'00000000',  type:'chrome',  en:'Chrome',            fr:'Chrome' },
        { id: 0, hex:'080808',      type:'metal',   en:'Black',             fr:'Noir' },
        { id: 1, hex:'0F0F0F',      type:'metal',   en:'Graphite',          fr:'Graphite' },
        { id: 2, hex:'1C1E21',      type:'metal',   en:'Black Steel',       fr:'Acier Noir' },
        { id: 3, hex:'292C2E',      type:'metal',   en:'Dark Steel',        fr:'Argent Sombre' },
        { id: 4, hex:'5A5E66',      type:'metal',   en:'Silver',            fr:'Argent' },
        { id: 5, hex:'777C87',      type:'metal',   en:'Bluish Silver',     fr:'Argent Bleu' },
        { id: 6, hex:'515459',      type:'metal',   en:'Rolled Steel',      fr:'Acier Grisé' },
        { id: 7, hex:'323B47',      type:'metal',   en:'Shadow Silver',     fr:'Argent Nocturne' },
        { id: 8, hex:'333333',      type:'metal',   en:'Stone Silver',      fr:'Roche Argentée' },
        { id: 9, hex:'1F2226',      type:'metal',   en:'Midnight Silver',   fr:'Argent Minuit' },
        { id: 10, hex:'23292E',     type:'metal',   en:'Cast Iron Silver',  fr:'Acier Armée' },
        { id: 11, hex:'121110',     type:'metal',   en:'Anthracite Black',  fr:'Anthracite' },
        { id: 12, hex:'050505',     type:'mate',    en:'Black',             fr:'Noir' },
        { id: 13, hex:'121212',     type:'mate',    en:'Gray',              fr:'Gris' },
        { id: 14, hex:'2F3233',     type:'mate',    en:'Light Gray',        fr:'Gris Clair' },
        { id: 15, hex:'080808',     type:'util',    en:'Black',             fr:'Noir' },
        { id: 16, hex:'121212',     type:'util',    en:'Black Poly',        fr:'Noir Poli' },
        { id: 17, hex:'202224',     type:'util',    en:'Dark silver',       fr:'Argent Sombre' },
        { id: 18, hex:'575961',     type:'util',    en:'Silver',            fr:'Argent' },
        { id: 19, hex:'23292E',     type:'util',    en:'Gun Metal',         fr:'Acier Armée' },
        { id: 20, hex:'323B47',     type:'util',    en:'Shadow Silver',     fr:'Argent Nocturne' },
        { id: 21, hex:'0F1012',     type:'used',    en:'Black',             fr:'Noir' },
        { id: 22, hex:'212121',     type:'used',    en:'Graphite',          fr:'Graphite' },
        { id: 23, hex:'5B5D5E',     type:'used',    en:'Silver Grey',       fr:'Argent Grisé' },
        { id: 24, hex:'888A99',     type:'used',    en:'Silver',            fr:'Argent' },
        { id: 25, hex:'697187',     type:'used',    en:'Blue Silver',       fr:'Argent Bleu' },
        { id: 26, hex:'3B4654',     type:'used',    en:'Shadow Silver',     fr:'Argent Nocturne' },
        { id: 93, hex:'57514B',     type:'metal',   en:'Champagne',         fr:'Champagne' },
        { id: 147, hex:'11141a',    type:'metal',   en:'MODSHOP?',          fr:'MODSHOP?' },
        { id: 156, hex:'414347',    type:'metal',   en:'DEFAULT?',          fr:'DEFAULT?' },
        { id: 113, hex:'615F55',    type:'used',    en:'Honey Beige',       fr:'Beige Grisé' },
        { id: 117, hex:'3B4045',    type:'brossed', en:'Steel',             fr:'Acier' },
        { id: 118, hex:'1A1E21',    type:'brossed', en:'Black Steel',       fr:'Acier Sombre' },
        { id: 119, hex:'5E646B',    type:'brossed', en:'Aluminium',         fr:'Aluminium' },
        { id: 131, hex:'D9D9D9',    type:'mate',    en:'Ice White',         fr:'Blanc' },
        { id: 132, hex:'F0F0F0',    type:'used',    en:'White',             fr:'Blanc' },
        { id: 134, hex:'FFFFFF',    type:'metal',   en:'Pure White',        fr:'Blanc' },
        { id: 111, hex:'F0F0F0',    type:'metal',   en:'Ice White',         fr:'Blanc' },
        { id: 112, hex:'B3B9C9',    type:'metal',   en:'Frost White',       fr:'Blanc Glacé' },
        { id: 121, hex:'B0B0B0',    type:'used',    en:'Off White',         fr:'Blanc Cassé' },
        { id: 122, hex:'999999',    type:'util',    en:'Off White',         fr:'Blanc Cassé' },


        { code:'red', 
          id: 27, hex:'690000',     type:'metal',   en:'Red',           fr:'Rouge' },
        { id: 28, hex:'8A0B00',     type:'metal',   en:'Torino',        fr:'Turin' },
        { id: 29, hex:'6B0000',     type:'metal',   en:'Formula',       fr:'Formule1' },
        { id: 30, hex:'611009',     type:'metal',   en:'Blaze',         fr:'Flamboyant' },
        { id: 31, hex:'4A0A0A',     type:'metal',   en:'Grace',         fr:'Gracieux' },
        { id: 32, hex:'470E0E',     type:'metal',   en:'Garnet',        fr:'Rouge Grenat' },
        { id: 33, hex:'380C00',     type:'metal',   en:'Sunset',        fr:'Framboise' },
        { id: 34, hex:'26030B',     type:'metal',   en:'Cabernet',      fr:'Cabernet' },
        { id: 35, hex:'630012',     type:'metal',   en:'Candy',         fr:'Rouge Bonbon' },
        { id: 39, hex:'780000',     type:'mate',    en:'Red',           fr:'Rouge' },
        { id: 40, hex:'360000',     type:'mate',    en:'Dark Red',      fr:'Rouge Sombre' },
        { id: 43, hex:'520000',     type:'util',    en:'Red',           fr:'Rouge' },
        { id: 44, hex:'8C0404',     type:'util',    en:'Bright Red',    fr:'Rouge Clair' },
        { id: 45, hex:'4A1000',     type:'util',    en:'Garnet Red',    fr:'Rouge Grenat' },
        { id: 46, hex:'592525',     type:'used',    en:'Red',           fr:'Rouge' },
        { id: 47, hex:'754231',     type:'used',    en:'Golden Red',    fr:'Rouge Doré' },
        { id: 48, hex:'210804',     type:'used',    en:'Dark Red',      fr:'Rouge Sombre' },
        { id: 150, hex:'6B0B00',    type:'metal',   en:'Lava Red',      fr:'Rouge Magma' },
        { id: 143, hex:'0e0d14',    type:'metal',   en:'Dark Red',      fr:'Rouge Sombre' },
        { id: 135, hex:'B01259',    type:'metal',   en:'Hot Pink',      fr:'Rose Pétant' },
        { id: 136, hex:'F69799',    type:'metal',   en:'Salmon Pink',   fr:'Rose Saumon' },
        { id: 137, hex:'8F2F55',    type:'metal',   en:'Pfister Pink',  fr:'Rose Vermillon' },


        { code:'orange', 
          id: 36, hex:'802800',     type:'metal',   en:'Sunrise Orange',    fr:'Soleil Levant' },
        { id: 37, hex:'6E4F2D',     type:'metal',   en:'Gold',              fr:'Orange Doré' },
        { id: 38, hex:'BD4800',     type:'metal',   en:'Orange 1',          fr:'Orange 1' },
        { id: 41, hex:'AB3F00',     type:'mate',    en:'Orange 2',          fr:'Orange 2' },
        { id: 123, hex:'B56519',    type:'used',    en:'Orange 3',          fr:'Orange 3' },
        { id: 130, hex:'C96E34',    type:'used',    en:'Orange 4',          fr:'Orange 4' },
        { id: 138, hex:'C26610',    type:'metal',   en:'Orange 5',          fr:'Orange 5' },
        { id: 124, hex:'C45C33',    type:'used',    en:'Bright Orange',     fr:'Orange Clair' },
        { id: 42, hex:'DE7E00',     type:'mate',    en:'Yellow',            fr:'Jaune' },
        { id: 88, hex:'F5890F',     type:'metal',   en:'Cab Yellow 1',      fr:'Jaune Taxi 1' },
        { id: 126, hex:'BA8425',    type:'used',    en:'Cab Yellow 2',      fr:'Jaune Taxi 2' },
        { id: 89, hex:'D9A600',     type:'metal',   en:'Race Yellow',       fr:'Jaune Course' },
        { id: 160, hex:'FFD859',    type:'brossed', en:'Rare Yellow',       fr:'Jaune Rare' }, //Not named in game ( "MP100")
        { id: 158, hex:'7a6440',    type:'metal',   en:'Pure Gold',         fr:'Or Pur' },
        { id: 159, hex:'47391B',    type:'brossed', en:'Brushed Gold',      fr:'Or brossed' },


        { code:'green', 
          id: 49, hex:'001207',     type:'metal',   en:'Dark Green',        fr:'Vert Sombre' },
        { id: 50, hex:'001A0B',     type:'metal',   en:'Racing Green',      fr:'Vert Rallye' },
        { id: 51, hex:'00211E',     type:'metal',   en:'Sea Green',         fr:'Vert Marin' },
        { id: 52, hex:'1F261E',     type:'metal',   en:'Olive Green',       fr:'Vert Olive' },
        { id: 53, hex:'003805',     type:'metal',   en:'Bright Green',      fr:'Vert' },
        { id: 54, hex:'0B4145',     type:'metal',   en:'Gasoline Green',    fr:'Vert Essence' },
        { id: 55, hex:'418503',     type:'mate',    en:'Lime Green',        fr:'Vert Clair' },
        { id: 56, hex:'0F1F15',     type:'util',    en:'Dark Green',        fr:'Vert Sombre' },
        { id: 57, hex:'023613',     type:'util',    en:'Green',             fr:'Vert' },
        { id: 58, hex:'162419',     type:'used',    en:'Dark Green',        fr:'Vert Sombre' },
        { id: 59, hex:'2A3625',     type:'used',    en:'Green',             fr:'Vert' },
        { id: 60, hex:'455C56',     type:'used',    en:'Sea Wash',          fr:'Vert Marin' },
        { id: 91, hex:'A2A827',     type:'metal',   en:'Parrot Green',      fr:'Vert Perroquet' },
        { id: 92, hex:'568F00',     type:'metal',   en:'Lime Green',        fr:'Vert Citron' },  
        { id: 125, hex:'47783C',    type:'metal',   en:'Gruppe6 Green',     fr:'Vert Gruppe6' },
        { id: 128, hex:'243022',    type:'mate',    en:'Green',             fr:'Vert' },
        { id: 133, hex:'3F4228',    type:'used',    en:'Zancudo Green',     fr:'Vert Zancudo' },
        { id: 139, hex:'69BD45',    type:'metal',   en:'Green',             fr:'Vert' },
        { id: 144, hex:'565751',    type:'metal',   en:'Hunter Green',      fr:'Vert Chasseur' },
        { id: 151, hex:'121710',    type:'mate',    en:'Spruce Green',      fr:'Vert Foret' },
        { id: 152, hex:'323325',    type:'mate',    en:'Olive Green',       fr:'Olive Terne' },
        { id: 155, hex:'2B302B',    type:'mate',    en:'Leaf Green',        fr:'Vert Feuille' },


        { code:'blue', 
          id: 140, hex:'00AEEF',    type:'metal',   en:'Blue',              fr:'Bleu' },
        { id: 61, hex:'000D14',     type:'metal',   en:'Galaxy Blue',       fr:'Bleu Minuit' },
        { id: 62, hex:'001029',     type:'metal',   en:'Dark Blue',         fr:'Bleu Sombre' },
        { id: 63, hex:'1C2F4F',     type:'metal',   en:'Saxon Blue',        fr:'Bleu Saxe' },
        { id: 64, hex:'001B57',     type:'metal',   en:'Blue',              fr:'Bleu' },
        { id: 65, hex:'3B4E78',     type:'metal',   en:'Mariner Blue',      fr:'Bleu US Marine' },
        { id: 66, hex:'272D3B',     type:'metal',   en:'Harbor Blue',       fr:'Bleu Port' },
        { id: 67, hex:'95B2DB',     type:'metal',   en:'Diamond Blue',      fr:'Bleu Diamant' },
        { id: 68, hex:'3E627A',     type:'metal',   en:'Surf Blue',         fr:'Bleu Surfer' },
        { id: 69, hex:'1C3140',     type:'metal',   en:'Nautical Blue',     fr:'Bleu Nautique' },
        { id: 70, hex:'0055C4',     type:'metal',   en:'Ultra Blue',        fr:'Bleu Clair' },
        { id: 71, hex:'1A182E',     type:'metal',   en:'Schafter Blue',     fr:'Bleu Pourpre' },
        { id: 72, hex:'161629',     type:'metal',   en:'Tardis Blue',       fr:'Bleu Tardis' },
        { id: 73, hex:'0E316D',     type:'metal',   en:'Racing Blue',       fr:'Bleu Ultra' },
        { id: 74, hex:'395A83',     type:'metal',   en:'Light Blue',        fr:'Bleu Clair' },
        { id: 75, hex:'09142E',     type:'util',    en:'Dark Blue',         fr:'Bleu Sombre' },
        { id: 76, hex:'0F1021',     type:'util',    en:'Midnight Blue',     fr:'Bleu Minuit' },
        { id: 77, hex:'152A52',     type:'util',    en:'Blue',              fr:'Bleu' },
        { id: 78, hex:'324654',     type:'util',    en:'Sea Foam Blue',     fr:'Bleu Fond Marins' },
        { id: 79, hex:'152563',     type:'util',    en:'Lightning Blue',    fr:'Bleu Foudroyant' },
        { id: 80, hex:'223BA1',     type:'util',    en:'Maui Blue Poly',    fr:'Bleu Mauï' },
        { id: 81, hex:'1F1FA1',     type:'util',    en:'Slate Blue',        fr:'Bleu Clair' },
        { id: 82, hex:'030E2E',     type:'mate',    en:'Dark Blue',         fr:'Bleu Sombre' },
        { id: 83, hex:'0F1E73',     type:'mate',    en:'Blue',              fr:'Bleu Mate' },
        { id: 84, hex:'001C32',     type:'mate',    en:'Midnight Blue',     fr:'Bleu Minuit' },
        { id: 85, hex:'2A3754',     type:'used',    en:'Dark Blue',         fr:'Bleu Sombre' },
        { id: 86, hex:'303C5E',     type:'used',    en:'Blue',              fr:'Bleu' },
        { id: 87, hex:'3B6796',     type:'used',    en:'Baby Blue',         fr:'Bleu Clair' },
        { id: 157, hex:'6690B5',    type:'metal',   en:'Epsilon Blue',      fr:'Bleu Epsilon' },
        { id: 127, hex:'2A77A1',    type:'metal',   en:'LSPD Blue',         fr:'Bleu LSPD' },


        { code:'maroon', 
          id: 90, hex:'4A341B',     type:'metal',   en:'Bronze',            fr:'Bronze' },
        { id: 94, hex:'291B06',     type:'metal',   en:'Feltzer Brow',      fr:'Beige Galets' },
        { id: 95, hex:'262117',     type:'metal',   en:'Creek Brown',       fr:'Ivoire Sombre' },
        { id: 96, hex:'120D07',     type:'metal',   en:'Chocolate',         fr:'Chocolat' },
        { id: 97, hex:'332111',     type:'metal',   en:'Maple Brown',       fr:'Marron Doré' },
        { id: 98, hex:'3D3023',     type:'metal',   en:'Saddle Brown',      fr:'Marron Clair' },
        { id: 99, hex:'5E5343',     type:'metal',   en:'Straw Brown',       fr:'Paille' },
        { id: 100, hex:'37382B',    type:'metal',   en:'Moss Brown',        fr:'Marron Mousse' },
        { id: 101, hex:'221918',    type:'metal',   en:'Bison Brown',       fr:'Marron Bison' },
        { id: 102, hex:'575036',    type:'metal',   en:'WoodBeech',         fr:'Marron Hêtre' },
        { id: 103, hex:'241309',    type:'metal',   en:'BeechWood',         fr:'Hêtre Sombre' },
        { id: 104, hex:'3B1700',    type:'metal',   en:'Sienna Brown',      fr:'Chocolat Orange' },
        { id: 105, hex:'6E6246',    type:'metal',   en:'Sandy Brown',       fr:'Sable' },
        { id: 106, hex:'998D73',    type:'metal',   en:'Bleached Brown',    fr:'Sable Blanc' },
        { id: 107, hex:'CFC0A5',    type:'metal',   en:'Cream',             fr:'Creme' },
        { id: 108, hex:'1F1709',    type:'util',    en:'Brown',             fr:'Marron' },
        { id: 109, hex:'3D311D',    type:'util',    en:'Medium Brown',      fr:'Marron Creme' },
        { id: 110, hex:'665847',    type:'util',    en:'Light Brown',       fr:'Marron Clair' },
        { id: 114, hex:'241E1A',    type:'used',    en:'Brown',             fr:'Marron' },
        { id: 115, hex:'171413',    type:'used',    en:'Dark Brown',        fr:'Marron Sombre' },
        { id: 116, hex:'3B372F',    type:'used',    en:'Straw Beige',       fr:'Paille Sombre' },
        { id: 129, hex:'6B5F54',    type:'mate',    en:'Brown',             fr:'Marron' },
        { id: 153, hex:'3B352D',    type:'mate',    en:'Dark Earth',        fr:'Marron Desert' },
        { id: 154, hex:'706656',    type:'mate',    en:'Desert Tan',        fr:'Beige Desert' },


        { code:'purple', 
          id: 141, hex:'0a0c17',    type:'metal',   en:'Midnight',          fr:'Minuit' },
        { id: 142, hex:'0c0d18',    type:'metal',   en:'Dark Purple',       fr:'Violet Sombre' },
        { id: 145, hex:'320642',    type:'metal',   en:'Purple',            fr:'Violet' },
        { id: 146, hex:'0b1421',    type:'metal',   en:'Night Purple',      fr:'Nuit Intense' },
        { id: 148, hex:'6b1f7b',    type:'mate',    en:'Schafter Purple',   fr:'Violet' },
        { id: 149, hex:'1e1d22',    type:'mate',    en:'Midnight',          fr:'Violet Sombre' },
        
    ],



    /**
     *  List of the neon colors
     *      It HEX colors, you can add as much as you want 
     *      Just dont use the 4th part of the hex color
     *      ( like do not use FFFFFF55 to make it half transparant )
     */
    couleursneon: [    
        'FFFFFF',          
        'C0C0C0',          
        '808080',                   
        'FF8200',          
        'FF0000',          
        '800000',          
        'FFFF00',          
        '808000',          
        '00FF00',          
        '008000',          
        '00FFFF',          
        '008080',          
        '0000FF',          
        '000080',          
        'FF00FF',          
        '800080',          

    ],



    /**
     *  List of the xenon colors
     *      THE COLORS ARE MADE BY GTAV YOU CAN ADD MORE
     *      You can edit the button color with "hex" 
     */
    couleursxenon : [
        { hex: 'FFFFFF',  fr :'Blanc',          en : 'White',           value : 0  },
        { hex: '008080',  fr :'Xenon',          en : 'Xenon',           value : -1 },
        { hex: '0000FF',  fr :'Bleu',           en : 'Blue',            value : 1  },
        { hex: '00FFFF',  fr :'Electrique',     en : 'Electric',        value : 2  },
        { hex: '008000',  fr :'Vert',           en : 'Green',           value : 3  },
        { hex: '00FF00',  fr :'Vert Clair',     en : 'Light Green',     value : 4  },
        { hex: 'FFFF00',  fr :'Jaune',          en : 'Yellow',          value : 5  },
        { hex: '808000',  fr :'Golden Shower',  en : 'Golden Shower',   value : 6  },
        { hex: 'FF8200',  fr :'Orange',         en : 'Orange',          value : 7  },
        { hex: 'FF0000',  fr :'Rouge',          en : 'Red',             value : 8  },
        { hex: 'FF00FF',  fr :'Rose Poney',     en : 'Pony Pink',       value : 9  },
        { hex: 'FF0080',  fr :'Rose Petant',    en : 'Hot Pink',        value : 10 },
        { hex: '800080',  fr :'Violet',         en : 'Purple',          value : 11 },
        { hex: 'ffffff22',  fr :'Lumiere Noire',  en : 'Black Light',   value : 12 },
    ],


    /** List of plates types */
    platetypes : [
        { id: 0, fr: 'SA Blanche', en:'SA White'  },
        { id: 1, fr: 'SA Noire', en:'SA Black'  },
        { id: 2, fr: 'SA Bleue', en:'SA Blue'  },
        { id: 3, fr: 'Petite SA', en:'Little SA'  },
        { id: 4, fr: 'SA Exempt', en:'SA Exempt'  },
        { id: 5, fr: 'Yankton', en:'Yankton'  },
        
    ],


},
watch: { 

    slider: function () {
        app.alerte = 'test'
        app.slidercurrent = document.getElementById('slider').value
    },

},
methods: {


/**
 *  Close the Menu
 *      Set needed variable to default 
 *      Ask the client to close too
 */
Fermer() {
    alt.emit('Close');
    app.catname = false;
    app.catupg = 'vide';
    app.catupgid = 0;
    app.extras = {}
    app.menu = false;
    app.visible = false;
    app.visiblecouleur = false;
    app.visiblestickers = false;
    app.visibleneon = false;
    app.visibleupgrades = false;
    app.visiblecustoms = false;
    app.visiblexenonlist = false;
    app.visibleplate = false;
    app.visibleextra = false;
},



/**
 *  Choice of Menu
 *      Remove color from all buttons
 *      Set needed variable to default
 *      Set all Menus visibility OFF
 *      Set wanted menu visible
 */
MenuChoice(menu) {
    try {

        document.getElementById('CatPrimary').style.background = "#ffffff22";
        document.getElementById('CatSeconde').style.background = "#ffffff22";
        document.getElementById('CatReflets').style.background = "#ffffff22";
        document.getElementById('CatStickers').style.background = "#ffffff22";
        document.getElementById('CatInterior').style.background = "#ffffff22"; 
        document.getElementById('CatMotor').style.background = "#ffffff22"; 
        document.getElementById('CatBrakes').style.background = "#ffffff22"; 
        document.getElementById('CatTransmission').style.background = "#ffffff22"; 
        document.getElementById('CatSuspension').style.background = "#ffffff22"; 
        document.getElementById('CatArmor').style.background = "#ffffff22"; 
        document.getElementById('CatTurbo').style.background = "#ffffff22"; 

    } catch (error) {}

    app.customs.forEach(c => {
        try{ document.getElementById('CatCustom'+c.type).style.background = "#ffffff22"; } catch (error) {}
    });

    if (menu == 'visiblecouleur') {
        alt.emit('AskStickers', app.modscount.stickers);
    }

    app.catname = false;
    app.catupg = 'vide';
    app.catwc = -1;
    app.extras = {}
    app.menu = false;
    app.visiblecouleur = false;
    app.visibleroues = false;
    app.visiblerouescouleur = false;
    app.visibleneon = false;
    app.visibleupgrades = false;
    app.visiblecustoms = false;
    app.visiblexenonlist = false;
    app.visibleplate = false;
    app.visibleextra = false;
    app[menu] = true
},



/** Select the Extra menu */
MenuChoiceExtras() {
    app.visibleplate = false;
    app.visibleextra = true;
    alt.emit('AskExtras');
},



/** Select the Plates menu */
MenuChoicePlates() { 
    app.visibleextra = false;
    app.visibleplate = true; 
},



/** Select the language */
Language(lang) { app.lang = lang },




/** Handler for POVs sliders */
POV() { 

    app.currentpov = document.getElementById('POV1').value;
    app.currentpov2 = document.getElementById('POV2').value * (-1);

    alt.emit('POVHandler', app.currentpov, app.currentpov2);
},



/** Set the previously selected vehicle part to chosen color */
ChoixCouleur(couleur) {
    // If no category choosen, alert
    if(app.catname == false) { app.alerte = app.texts[app.lang].ChooseCat } 
    else {
        // Alert which color has been selected for which category and apply it
        app.alerte = app.texts[app.lang].color + ' ' + app.catname + ' : ' + couleur[app.lang] + ' [' + app.texts[app.lang][couleur.type] + ']';
        alt.emit('ColorHandler', app.catname, couleur);
    }
},



/** Set sticker to chosen one */
Stickers(sticker) { 
    app.alerte = app.texts[app.lang].Stickers + ' n°' + sticker;
    alt.emit('StickerHandler', sticker);
},


/** Set livery to chosen one */
Livery(livery) { 
    app.alerte = app.texts[app.lang].Livery + ' n°' + livery;
    alt.emit('LiveryHandler', livery);
},


/** Set roof livery to chosen one */
Roof(livery) { 
    app.alerte = app.texts[app.lang].Livery + ' n°' + livery;
    alt.emit('RoofHandler', livery);
},


/** Set chosen neon ON / OFF */
NeonOnOff(neon) { 
    app.visiblexenonlist = false
    alt.emit('NeonONOFFHandler', neon); 
},  



/** Set neons to chosen color */
Neon(couleur) { alt.emit('NeonHandler', couleur); }, 



/** Set xenon color list visible */
VisibleXenon() { app.visiblexenonlist = true },



/** Set xenon to chosen color */
Xenon(couleur) { alt.emit('Xenon', couleur);  },



/** Set to num or Switch asked Mod */
SwitchMod(mod){ alt.emit('SwitchMod', mod); },
SetMod(mod, num){ alt.emit('SetMod', mod, num); },



/**
 *  Choice of Color Category
 *      Remove color from all buttons
 *      Set current category button green ( except stickers )
 *      Set catname to current color category
 */
ChoixCat(cat) {
    // Change color of selected category button
    document.getElementById('CatPrimary').style.background = "#ffffff22";
    document.getElementById('CatSeconde').style.background = "#ffffff22";
    document.getElementById('CatReflets').style.background = "#ffffff22";
    document.getElementById('CatStickers').style.background = "#ffffff22";
    document.getElementById('CatInterior').style.background = "#ffffff22";
    document.getElementById('CatJantes').style.background = "#ffffff22";

    if (cat == 'Premiere') { 
        document.getElementById('CatPrimary').style.background = "green"; 
        app.catname = 'Principale'; 
    } else if (cat == 'Seconde') { 
        document.getElementById('CatSeconde').style.background = "green"; 
        app.catname = 'Secondaire';
    } else if (cat == 'Reflets') { 
        document.getElementById('CatReflets').style.background = "green"; 
        app.catname = 'Reflets';
    } else if (cat == 'Stickers') { 
        app.catname = 'Stickers';
    } else if (cat == 'Interieur') { 
        document.getElementById('CatInterior').style.background = "green"; 
        app.catname = 'Interieur';
    } else if (cat == 'Jantes') { 
        document.getElementById('CatJantes').style.background = "green"; 
        app.catname = 'Jantes';
    }
    
},



/**
 *  Choice of Upgrade / Custom Category
 *      Remove color from all buttons
 *      Set current category button green
 *      Set catupg and catupgid to current upgrade / custom category
 *      Set slider position to current mod on this vehicle
 *      Set slider maximum to mod's max on this vehicle
 */
ChoixUpg(cat, id, catid) {

    try {
        document.getElementById('CatMotor').style.background = "#ffffff22"; 
        document.getElementById('CatBrakes').style.background = "#ffffff22";
        document.getElementById('CatTransmission').style.background = "#ffffff22";
        document.getElementById('CatSuspension').style.background = "#ffffff22";
        document.getElementById('CatArmor').style.background = "#ffffff22";
        document.getElementById('CatTurbo').style.background = "#ffffff22";
    } catch (error) {}

    app.customs.forEach(c => {
        try{ document.getElementById('CatCustom'+c.type).style.background = "#ffffff22"; } catch (error) {}
    });

    document.getElementById(id.currentTarget.id).style.background = "green";

    app.catupg = cat; 
    app.catupgid = catid;
    app.slidercurrent = app.currentmods[cat]
    app.slidermax = app.modscount[cat]
    
}, 



/**
 *  Choice of Upgrade / Custom Category
 *      Remove color from all buttons
 *      Set current category button green
 *      Set catwc to chosen wheel category
 *      Set slider position to 0
 *      Ask client to get wheel type ( and slider's ) maximum
 */
WheelsCat(cat, id) {

    try {
        document.getElementById('CatMotor').style.background = "#ffffff22"; 
        document.getElementById('CatBrakes').style.background = "#ffffff22";
        document.getElementById('CatTransmission').style.background = "#ffffff22";
        document.getElementById('CatSuspension').style.background = "#ffffff22";
        document.getElementById('CatArmor').style.background = "#ffffff22";
        document.getElementById('CatTurbo').style.background = "#ffffff22";
    } catch (error) {}

    for (let i = 0; i < 9; i++) {
        try{ document.getElementById('CatWC'+i).style.background = "#ffffff22"; } catch (error) {}
    }

    document.getElementById(id.currentTarget.id).style.background = "green";

    app.catwc = cat;
    app.slidercurrent = 0

    alt.emit('SetWheelsCat', app.catwc); 
}, 



/** Handler for using the wheels slider */
SliderWatchWheels (id) { 
    app.slidercurrent = document.getElementById(id.currentTarget.id).value
    app.currentmods[app.catupg] = app.slidercurrent
    alt.emit('SetWheels', app.slidercurrent); 
    
},



/** Handler for using the others slider */
SliderWatch (id) { 
    app.slidercurrent = document.getElementById(id.currentTarget.id).value
    app.currentmods[app.catupg] = app.slidercurrent
    alt.emit('SetMod', app.catupgid, app.slidercurrent); 

},



/** Extras Change Handler */
Extras(i) { alt.emit('Extras', i); },



/** Plate Change Handler */
PlateChanger(plate) { alt.emit('PlateChanger', plate); },



/**
 *  Bonus Handlers
 *      Handler for Doors Bonus
 *      Handler for Repair Bonus
 *      Handler for Clean Bonus
 *      Handler for Engine Bonus
 */
BonusPortes() {  alt.emit('BonusPortes');  },
BonusRepair() {  alt.emit('BonusRepair');  },
BonusClean() {  alt.emit('BonusClean');  },
BonusMoteur() {  alt.emit('BonusMoteur');  },

    }
});

