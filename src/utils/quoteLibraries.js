// Wood Library presets per Reference B
export const WOOD_LIBRARY = [
  {
    id: 'thermo_frake',
    name: 'Thermo Fraké',
    lifespan: '20 tot 25 jaar',
    infoboxTitle: 'Over Thermo Fraké',
    infoboxText: 'Thermisch behandeld Fraké: vormstabiel, duurzaam en met een warme, diepe kleur. Gaat 20 tot 25 jaar mee en veroudert prachtig grijs.'
  },
  {
    id: 'padouk',
    name: 'Padouk',
    lifespan: '20 tot 25 jaar',
    infoboxTitle: 'Over Padouk',
    infoboxText: 'Padouk is een van de meest stabiele houtsoorten ter wereld. Koraalrood bij verwerking, snel verkleurend naar warm zilvergrijs.'
  },
  {
    id: 'douglas',
    name: 'Douglas',
    lifespan: '10 tot 15 jaar',
    infoboxTitle: 'Over Douglas',
    infoboxText: 'Douglas hout heeft een warme en authentieke uitstraling, ideaal voor beschutte buitenopstellingen.'
  }
];

// Product Library items per Reference B
export const PRESET_PRODUCT_LIBRARY = [
  {
    id: 'lib-1',
    title: 'Buitenkeuken Thermo Fraké',
    description: 'Thermo Fraké buitenkeuken 240 x 80 cm, afgewerkt in twee lagen beschermende olie',
    priceInclVat: 3495,
    vatRate: 21,
    isIncluded: false
  },
  {
    id: 'lib-2',
    title: 'Massief Teak Hout Buitenkeuken Cabinet (300x90cm)',
    description: 'Massief teakhouten frame met rvs scharnieren en soft-close lades',
    priceInclVat: 4200,
    vatRate: 21,
    isIncluded: false
  },
  {
    id: 'lib-3',
    title: 'Big Green Egg Large Uitsparing & Base Support',
    description: 'Uitsparing op maat gemaakt voor Big Green Egg Large met hittebestendige onderlaag',
    priceInclVat: 450,
    vatRate: 21,
    isIncluded: false
  },
  {
    id: 'lib-4',
    title: 'RVS Inbouw Buitenkoelkast Premium 80L',
    description: 'Geïntegreerde rvs buitenkoelkast, geschikt voor alle seizoenen',
    priceInclVat: 890,
    vatRate: 21,
    isIncluded: false
  },
  {
    id: 'lib-5',
    title: 'RVS Spoelbak & Mengkraan Inbouwset',
    description: 'Onderbouw rvs spoelbak met luxe zwarte mengkraan',
    priceInclVat: 390,
    vatRate: 21,
    isIncluded: false
  },
  {
    id: 'lib-6',
    title: 'Bezorging & Professionele Inhuizen',
    description: 'Persoonlijke bezorging en plaatsing in uw achtertuin',
    priceInclVat: 0,
    vatRate: 21,
    isIncluded: true
  }
];

// Default Template Configurations per Product Type
export const PRODUCT_TYPE_DEFAULTS = {
  'Outdoor kitchen': {
    titleLine1: 'Uw buitenkeuken,',
    titleLine2: 'op maat gemaakt.',
    letterParagraphs: [
      'Hartelijk dank voor je aanvraag en het prettige gesprek. Met veel plezier presenteren wij deze persoonlijke offerte voor jouw maatwerk buitenkeuken.',
      'Bij Vanuit Ambacht geloven we in duurzame materialen, ambachtelijke afwerking en oog voor detail. Wij maken al onze buitenkeukens met de hand in onze werkplaats.',
      'In dit document vind je het volledige overzicht van jouw gekozen configuratie, inclusief specificaties, 3D/vooraanzicht tekening en transparante investering.',
      'Heb je vragen of wens je nog aanpassingen? Wij denken graag met je mee!'
    ],
    checklist: [
      'Volledig maatwerk, gebouwd door een gecertificeerde vakspecialist',
      'Digitale tekening vooraf ter goedkeuring',
      '{finish}',
      'Gratis bezorging in {city}',
      'Garantie en nazorg na levering'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Akkoord op de offerte', badgeText: '', isGratisBadge: false },
      { stepNumber: 2, title: 'Digitale tekening ter bevestiging', badgeText: '', isGratisBadge: false },
      { stepNumber: 3, title: 'Productie door onze vakspecialist', badgeText: '{deliveryTime}', isGratisBadge: false },
      { stepNumber: 4, title: 'Bezorging in {city}', badgeText: 'GRATIS', isGratisBadge: true },
      { stepNumber: 5, title: 'Garantie & nazorg', badgeText: '', isGratisBadge: false }
    ]
  },
  'Garden room': {
    titleLine1: 'Uw tuinkamer,',
    titleLine2: 'exclusief ontworpen.',
    letterParagraphs: [
      'Hartelijk dank voor je aanvraag voor een maatwerk tuinkamer.',
      'Onze tuinkamers worden ambachtelijk vervaardigd van de hoogste kwaliteit houtsoorten.',
      'Bekijk in dit overzicht de exacte maatvoering, glazen schuifwanden en investering.',
      'Neem gerust contact op voor vragen of maatwerkopties.'
    ],
    checklist: [
      'Volledig maatwerk houten constructie',
      'Architectonische bouwtekening vooraf',
      '{finish}',
      'Gratis bezorging & montage in {city}',
      '10 jaar garantie op de houtconstructie'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Akkoord op de offerte', badgeText: '', isGratisBadge: false },
      { stepNumber: 2, title: 'Bouwtekening & vergunningscheck', badgeText: '', isGratisBadge: false },
      { stepNumber: 3, title: 'Prefab productie in werkplaats', badgeText: '{deliveryTime}', isGratisBadge: false },
      { stepNumber: 4, title: 'Montage in {city}', badgeText: 'GRATIS', isGratisBadge: true },
      { stepNumber: 5, title: 'Oplevering & garantie', badgeText: '', isGratisBadge: false }
    ]
  },
  'Veranda': {
    titleLine1: 'Uw houten veranda,',
    titleLine2: 'perfect afgewerkt.',
    letterParagraphs: [
      'Hierbij ontvangt u het voorstel op maat voor uw houten veranda.',
      'Duurzaam gebouwd om in alle seizoenen van uw tuin te genieten.',
      'Alle materialen en investeringsspecificaties vindt u op de volgende pagina\'s.',
      'Wij kijken uit naar een prettige samenwerking.'
    ],
    checklist: [
      'Robuuste gebinten & verankering',
      'Detailtekening ter accordering',
      '{finish}',
      'Bezorging in {city}',
      'Garantie op constructie & dakbedekking'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Akkoord op de offerte', badgeText: '', isGratisBadge: false },
      { stepNumber: 2, title: 'Werktekening ter controle', badgeText: '', isGratisBadge: false },
      { stepNumber: 3, title: 'Houtbewerking & voorbereiding', badgeText: '{deliveryTime}', isGratisBadge: false },
      { stepNumber: 4, title: 'Bezorging & plaatsing in {city}', badgeText: 'GRATIS', isGratisBadge: true },
      { stepNumber: 5, title: 'Garantie & nazorg', badgeText: '', isGratisBadge: false }
    ]
  },
  'Poolhouse': {
    titleLine1: 'Uw luxe poolhouse,',
    titleLine2: 'ambachtelijk gemaakt.',
    letterParagraphs: [
      'Met trots presenteren wij het ontwerp en voorstel voor uw maatwerk poolhouse.',
      'Gecombineerd met berging, kleedruimte en overdekt terras.',
      'In deze offerte leest u alles over de specificaties en planning.',
      'Vragen? Wij staan direct voor u klaar.'
    ],
    checklist: [
      'Exclusief ontwerp met geïntegreerde berging',
      'Digitale CAD constructietekening',
      '{finish}',
      'Gratis bezorging in {city}',
      'Volledige nazorg en service'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Akkoord op de offerte', badgeText: '', isGratisBadge: false },
      { stepNumber: 2, title: 'CAD tekening ter goedkeuring', badgeText: '', isGratisBadge: false },
      { stepNumber: 3, title: 'Ambachtelijke productie', badgeText: '{deliveryTime}', isGratisBadge: false },
      { stepNumber: 4, title: 'Bezorging in {city}', badgeText: 'GRATIS', isGratisBadge: true },
      { stepNumber: 5, title: 'Oplevering & garantie', badgeText: '', isGratisBadge: false }
    ]
  }
};
