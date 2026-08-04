const getRelativeDate = (daysAgo) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockPartners = [
  {
    id: 'PART-001',
    name: 'CraftWood Veluwe',
    contactPerson: 'Erik van den Berg',
    email: 'erik@craftwood.nl',
    phone: '+31 6 1234 5678',
    status: 'Actief',
    region: 'Gelderland',
    workload: 'Beschikbaar',
    rating: 4.9,
    completedProjects: 14,
    productTypes: ['Buitenkeukens', 'Overkappingen'],
    specialties: ['Eikenhout Constructies', 'RVS Inbouw']
  },
  {
    id: 'PART-002',
    name: 'StaalWerk Brabant',
    contactPerson: 'Karel De Jong',
    email: 'karel@staalwerk.nl',
    phone: '+31 6 8765 4321',
    status: 'Actief',
    region: 'Noord-Brabant',
    workload: 'Druk',
    rating: 4.7,
    completedProjects: 9,
    productTypes: ['Kliko ombouwen', 'Stalen Frames'],
    specialties: ['Poedercoaten', 'Maatwerk Klikobox']
  },
  {
    id: 'PART-003',
    name: 'Hout & Steen Utrecht',
    contactPerson: 'Lisa Bakker',
    email: 'lisa@houtsteen.nl',
    phone: '+31 6 5544 3322',
    status: 'Actief',
    region: 'Utrecht',
    workload: 'Volgeboekt',
    rating: 4.8,
    completedProjects: 22,
    productTypes: ['Buitenverblijf', 'Poolhouse'],
    specialties: ['Beton Cire', 'Luxe Poolhouses']
  },
  {
    id: 'PART-004',
    name: 'De Gelderse Ambacht',
    contactPerson: 'Wouter Meijer',
    email: 'info@gelderseambacht.nl',
    phone: '+31 6 7788 9900',
    status: 'Inactief',
    region: 'Gelderland',
    workload: 'Inactief',
    rating: 4.5,
    completedProjects: 6,
    productTypes: ['Buitenkeukens'],
    specialties: ['Tijdelijk Gepauzeerd']
  },
  {
    id: 'PART-005',
    name: 'Noord-Zeeland Houtbouw',
    contactPerson: 'Sanne Smits',
    email: 'contact@zeelandhout.nl',
    phone: '+31 6 6655 4433',
    status: 'Inactief',
    region: 'Zeeland',
    workload: 'Inactief',
    rating: 4.2,
    completedProjects: 4,
    productTypes: ['Overkappingen'],
    specialties: ['Contract Verlopen']
  }
];

export const mockLeads = [
  {
    id: 'L-1001',
    name: 'John Miller',
    phone: '+31 6 1122 3344',
    email: 'john.miller@gmail.com',
    productType: 'buitenkeuken',
    size: '4x1.2m',
    source: 'Google Ads',
    status: 'Gewonnen',
    assignedTo: 'Tim',
    date: getRelativeDate(15),
    lastContactDate: getRelativeDate(3),
    lostReason: ''
  },
  {
    id: 'L-1002',
    name: 'Sophia Taylor',
    phone: '+31 6 9988 7766',
    email: 'sophia.taylor@outlook.com',
    productType: 'kliko',
    size: '3 Container Box',
    source: 'Facebook',
    status: 'Offerte verstuurd',
    assignedTo: 'Bram',
    date: getRelativeDate(10),
    lastContactDate: getRelativeDate(1),
    lostReason: ''
  },
  {
    id: 'L-1003',
    name: 'Mark Davis',
    phone: '+31 6 4455 6677',
    email: 'mark.davis@gmail.com',
    productType: 'overkapping',
    size: '6x4m',
    source: 'Direct',
    status: 'In gesprek',
    assignedTo: 'Tim',
    date: getRelativeDate(5),
    lastContactDate: getRelativeDate(1),
    lostReason: ''
  },
  {
    id: 'L-1004',
    name: 'Emma Wilson',
    phone: '+31 6 3322 1100',
    email: 'emma.wilson@hotmail.com',
    productType: 'poolhouse',
    size: '8x4m Luxe',
    source: 'Referral',
    status: 'Nieuw',
    assignedTo: 'Bram',
    date: getRelativeDate(6),
    lastContactDate: getRelativeDate(4),
    lostReason: ''
  }
];

export const mockQuotes = [
  {
    id: 'Q-4001',
    customer: 'John Miller',
    project: 'Luxe Teak Buitenkeuken 4m',
    amount: '€ 11,300',
    date: getRelativeDate(12),
    status: 'Geaccepteerd',
    discountPercent: 0,
    items: [
      { description: 'Buitenkeuken Teak Hout Frame 4m', quantity: 1, unitPrice: 8500 },
      { description: 'Beton Aanrechtblad met Kamado Uitsparing', quantity: 1, unitPrice: 2800 }
    ]
  },
  {
    id: 'Q-4002',
    customer: 'Sophia Taylor',
    project: 'Kliko Ombouw Triple Antraciet',
    amount: '€ 1,850',
    date: getRelativeDate(8),
    status: 'Verzonden',
    discountPercent: 5,
    items: [
      { description: 'Triple 240L Klikobox Gepoedercoat Stalen Frame', quantity: 1, unitPrice: 1947 }
    ]
  },
  {
    id: 'Q-4003',
    customer: 'Mark Davis',
    project: 'Eiken Houten Overkapping 6x4m',
    amount: '€ 14,500',
    date: getRelativeDate(4),
    status: 'Concept',
    discountPercent: 0,
    items: [
      { description: 'Rustiek Eiken Gebint Constructie', quantity: 1, unitPrice: 11000 },
      { description: 'EPDM Daksysteem & Zinken Hemelwaterafvoer', quantity: 1, unitPrice: 3500 }
    ]
  }
];

export const mockProjects = [
  {
    id: 'PRJ-101',
    name: 'Luxe Teak Buitenkeuken 4m',
    customer: 'John Miller',
    partner: 'CraftWood Veluwe',
    progress: 65,
    deadline: getRelativeDate(-14), // 14 days in future
    status: 'In Progress',
    orderStatus: 'Productie gestart',
    quoteId: 'Q-4001',
    value: '€ 11,300'
  },
  {
    id: 'PRJ-102',
    name: 'Kliko Ombouw Triple Antraciet',
    customer: 'Sophia Taylor',
    partner: 'StaalWerk Brabant',
    progress: 20,
    deadline: getRelativeDate(-21),
    status: 'Pending',
    orderStatus: 'In afwachting van staal',
    quoteId: 'Q-4002',
    value: '€ 1,850'
  }
];

export const mockInvoices = [
  {
    id: 'INV-4001-A',
    quoteId: 'Q-4001',
    customer: 'John Miller',
    type: '50% Aanbetaling (Upfront)',
    amount: '€ 5,650',
    numericAmount: 5650,
    status: 'Betaald',
    dueDate: getRelativeDate(5),
    createdDate: getRelativeDate(12)
  },
  {
    id: 'INV-4001-B',
    quoteId: 'Q-4001',
    customer: 'John Miller',
    type: '50% Eindfactuur (Completion)',
    amount: '€ 5,650',
    numericAmount: 5650,
    status: 'Openstaand',
    dueDate: getRelativeDate(-14),
    createdDate: getRelativeDate(12)
  }
];

export const mockTasks = [
  {
    id: 'TSK-101',
    title: 'Inmeten buitenkeuken bij John Miller',
    customer: 'John Miller',
    project: 'Luxe Teak Buitenkeuken 4m',
    dueDate: getRelativeDate(-1),
    priority: 'Hoog',
    status: 'Voltooid',
    assignedTo: 'Admin'
  },
  {
    id: 'TSK-102',
    title: 'Kleurstalen opsturen naar Sophia Taylor',
    customer: 'Sophia Taylor',
    project: 'Kliko Ombouw Triple Antraciet',
    dueDate: getRelativeDate(0),
    priority: 'Medium',
    status: 'Openstaand',
    assignedTo: 'Admin'
  },
  {
    id: 'TSK-103',
    title: 'Offerte Q-4003 nabellen (Mark Davis)',
    customer: 'Mark Davis',
    project: 'Eiken Houten Overkapping 6x4m',
    dueDate: getRelativeDate(-2),
    priority: 'Hoog',
    status: 'Openstaand',
    assignedTo: 'Admin'
  }
];

export const mockRecentActivities = [
  { id: 1, type: 'lead', title: 'New lead received', detail: 'Emma Wilson (Poolhouse 8x4m)', time: '2 hours ago' },
  { id: 2, type: 'invoice', title: 'Invoice paid', detail: 'John Miller (€ 5,650 deposit)', time: '1 day ago' },
  { id: 3, type: 'quote', title: 'Quote approved', detail: 'Q-4001 by John Miller', time: '2 days ago' }
];

export const mockFollowUps = [
  { id: 'FOL-101', name: 'Sophia Taylor', type: 'Offerte Q-4002 nabellen', due: 'Vandaag' },
  { id: 'FOL-102', name: 'Mark Davis', type: 'Opties overkapping bespreken', due: 'Morgen' },
  { id: 'FOL-103', name: 'Emma Wilson', type: 'Intakegesprek poolhouse inplannen', due: 'Over 2 dagen' }
];

export const mockDeliveries = [
  { id: 'DEL-101', project: 'Luxe Teak Buitenkeuken 4m', customer: 'John Miller', date: 'Vr 14 Aug', partner: 'CraftWood Veluwe' },
  { id: 'DEL-102', project: 'Kliko Ombouw Triple Antraciet', customer: 'Sophia Taylor', date: 'Wo 19 Aug', partner: 'StaalWerk Brabant' },
  { id: 'DEL-103', project: 'Eiken Houten Overkapping 6x4m', customer: 'Mark Davis', date: 'Ma 24 Aug', partner: 'Hout & Steen Utrecht' }
];

export const mockWarnings = [
  { id: 'WRN-101', type: 'Openstaande Aanbetaling', customer: 'Sophia Taylor', detail: 'Offerte Q-4002 van Sophia Taylor wacht op aanbetaling van € 925.' },
  { id: 'WRN-102', type: 'Levering Nadert', customer: 'John Miller', detail: 'PRJ-101 (John Miller) moet over 14 dagen opgeleverd worden.' }
];

export const mockProfitLossData = [
  {
    projectId: 'PRJ-101',
    projectName: 'Luxe Teak Buitenkeuken 4m',
    customer: 'John Miller',
    category: 'Buitenkeukens',
    revenue: 11300,
    partnerCost: 3200,
    materialCost: 1650,
    otherCost: 0
  },
  {
    projectId: 'PRJ-102',
    projectName: 'Kliko Ombouw Triple Antraciet',
    customer: 'Sophia Taylor',
    category: 'Kliko Ombouwen',
    revenue: 1850,
    partnerCost: 520,
    materialCost: 300,
    otherCost: 0
  },
  {
    projectId: 'PRJ-103',
    projectName: 'Eiken Houten Overkapping 6x4m',
    customer: 'Mark Davis',
    category: 'Overkappingen',
    revenue: 14500,
    partnerCost: 4500,
    materialCost: 2300,
    otherCost: 0
  },
  {
    projectId: 'PRJ-104',
    projectName: 'Tuinterras De Luxe',
    customer: 'Emma Wilson',
    category: 'Terrassen',
    revenue: 8900,
    partnerCost: 2400,
    materialCost: 1200,
    otherCost: 0
  }
];

export const mockBankTransactions = [
  {
    id: 'TXN-9001',
    description: '50% Aanbetaling Ontvangen - Jan de Vries (INV-4001-A)',
    category: 'Verkoop / Omzet',
    type: 'Income',
    amount: '€ 5,650',
    numericAmount: 5650,
    date: getRelativeDate(12)
  },
  {
    id: 'TXN-9002',
    description: 'Betaling Kliko Ombouw - Sophie Bakken (INV-4002-A)',
    category: 'Verkoop / Omzet',
    type: 'Income',
    amount: '€ 1,850',
    numericAmount: 1850,
    date: getRelativeDate(8)
  },
  {
    id: 'TXN-9003',
    description: 'Inkoop Teak Hout & Granieten Bladen - CraftWood Veluwe',
    category: 'Materiaal Inkoop',
    type: 'Expense',
    amount: '€ 2,400',
    numericAmount: 2400,
    date: getRelativeDate(6)
  },
  {
    id: 'TXN-9004',
    description: 'Uitbetaling Vakman Voorschot - Sven Hoek (Hoek Bouw)',
    category: 'Onderaanneming / Partner',
    type: 'Expense',
    amount: '€ 1,500',
    numericAmount: 1500,
    date: getRelativeDate(4)
  },
  {
    id: 'TXN-9005',
    description: 'Aanbetaling Houten Overkapping - Mark de Boer',
    category: 'Verkoop / Omzet',
    type: 'Income',
    amount: '€ 4,200',
    numericAmount: 4200,
    date: getRelativeDate(2)
  }
];

export const mockFunnelData = {
  leads: { count: 4, label: "Leads deze maand" },
  inGesprek: { count: 1, label: "In gesprek", percentage: 25 },
  offerte: { count: 1, label: "Offerte verstuurd", percentage: 25 },
  gewonnen: { count: 1, label: "Gewonnen (Project)", percentage: 25 }
};

export const mockFinancials = {
  monthlyRevenue: '€ 5.650',
  outstandingInvoices: '€ 5.650',
  expectedRevenue: '€ 11.300'
};
