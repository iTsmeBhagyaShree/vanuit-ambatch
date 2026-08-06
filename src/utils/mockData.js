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
    project: 'Luxury Teak Outdoor Kitchen 4m',
    amount: '€ 11,300',
    date: getRelativeDate(12),
    status: 'Accepted',
    discountPercent: 0,
    items: [
      { description: 'Outdoor Kitchen Teak Wood Frame 4m', quantity: 1, unitPrice: 8500 },
      { description: 'Concrete Countertop with Kamado Cutout', quantity: 1, unitPrice: 2800 }
    ]
  },
  {
    id: 'Q-4002',
    customer: 'Sophia Taylor',
    project: 'Triple Bin Storage Anthracite',
    amount: '€ 1,850',
    date: getRelativeDate(8),
    status: 'Sent',
    discountPercent: 5,
    items: [
      { description: 'Triple 240L Bin Storage Powder-coated Steel Frame', quantity: 1, unitPrice: 1947 }
    ]
  },
  {
    id: 'Q-4003',
    customer: 'Mark Davis',
    project: 'Oak Wooden Canopy 6x4m',
    amount: '€ 14,500',
    date: getRelativeDate(4),
    status: 'Draft',
    discountPercent: 0,
    items: [
      { description: 'Rustic Oak Beam Construction', quantity: 1, unitPrice: 11000 },
      { description: 'EPDM Roof System & Zinc Drainage', quantity: 1, unitPrice: 3500 }
    ]
  }
];

export const mockProjects = [
  {
    id: 'PRJ-101',
    name: 'Luxury Teak Outdoor Kitchen 4m',
    customer: 'John Miller',
    partner: 'CraftWood Veluwe',
    progress: 65,
    deadline: getRelativeDate(-14), // 14 days in future
    status: 'In Progress',
    orderStatus: 'Production started',
    quoteId: 'Q-4001',
    value: '€ 11,300'
  },
  {
    id: 'PRJ-102',
    name: 'Triple Bin Storage Anthracite',
    customer: 'Sophia Taylor',
    partner: 'StaalWerk Brabant',
    progress: 20,
    deadline: getRelativeDate(-21),
    status: 'Pending',
    orderStatus: 'Awaiting steel',
    quoteId: 'Q-4002',
    value: '€ 1,850'
  }
];

export const mockInvoices = [
  {
    id: 'INV-4001-A',
    quoteId: 'Q-4001',
    customer: 'John Miller',
    type: '50% Down Payment (Upfront)',
    amount: '€ 5,650',
    numericAmount: 5650,
    status: 'Paid',
    dueDate: getRelativeDate(5),
    createdDate: getRelativeDate(12)
  },
  {
    id: 'INV-4001-B',
    quoteId: 'Q-4001',
    customer: 'John Miller',
    type: '50% Final Invoice (Completion)',
    amount: '€ 5,650',
    numericAmount: 5650,
    status: 'Pending',
    dueDate: getRelativeDate(-14),
    createdDate: getRelativeDate(12)
  }
];

export const mockTasks = [
  {
    id: 'TSK-101',
    title: 'Measure outdoor kitchen for John Miller',
    customer: 'John Miller',
    project: 'Luxury Teak Outdoor Kitchen 4m',
    dueDate: getRelativeDate(-1),
    priority: 'High',
    status: 'Completed',
    assignedTo: 'Tim',
    assignee: 'Tim'
  },
  {
    id: 'TSK-102',
    title: 'Send color samples to Sophia Taylor',
    customer: 'Sophia Taylor',
    project: 'Bin Storage Triple Anthracite',
    dueDate: getRelativeDate(0),
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Tim',
    assignee: 'Tim'
  },
  {
    id: 'TSK-103',
    title: 'Follow up on Quote Q-4003 (Mark Davis)',
    customer: 'Mark Davis',
    project: 'Oak Wooden Canopy 6x4m',
    dueDate: getRelativeDate(-2),
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Tim',
    assignee: 'Tim'
  }
];

export const mockRecentActivities = [
  { id: 1, type: 'lead', title: 'New lead received', detail: 'Emma Wilson (Poolhouse 8x4m)', time: '2 hours ago' },
  { id: 2, type: 'invoice', title: 'Invoice paid', detail: 'John Miller (€ 5,650 deposit)', time: '1 day ago' },
  { id: 3, type: 'quote', title: 'Quote approved', detail: 'Q-4001 by John Miller', time: '2 days ago' }
];

export const mockFollowUps = [
  { id: 'FOL-101', name: 'Sophia Taylor', type: 'Follow up on Quote Q-4002', due: 'Today' },
  { id: 'FOL-102', name: 'Mark Davis', type: 'Discuss canopy options', due: 'Tomorrow' },
  { id: 'FOL-103', name: 'Emma Wilson', type: 'Schedule intake consultation poolhouse', due: 'In 2 days' }
];

export const mockDeliveries = [
  { id: 'DEL-101', project: 'Luxury Teak Outdoor Kitchen 4m', customer: 'John Miller', date: 'Fri 14 Aug', partner: 'CraftWood Veluwe' },
  { id: 'DEL-102', project: 'Bin Storage Triple Anthracite', customer: 'Sophia Taylor', date: 'Wed 19 Aug', partner: 'StaalWerk Brabant' },
  { id: 'DEL-103', project: 'Oak Wooden Canopy 6x4m', customer: 'Mark Davis', date: 'Mon 24 Aug', partner: 'Hout & Steen Utrecht' }
];

export const mockWarnings = [
  { id: 'WRN-101', type: 'Pending Down Payment', customer: 'Sophia Taylor', detail: 'Quote Q-4002 from Sophia Taylor is awaiting deposit of € 925.' },
  { id: 'WRN-102', type: 'Delivery Approaching', customer: 'John Miller', detail: 'PRJ-101 (John Miller) is due for delivery in 14 days.' }
];

export const mockProfitLossData = [
  {
    projectId: 'PRJ-101',
    projectName: 'Luxury Teak Outdoor Kitchen 4m',
    customer: 'John Miller',
    category: 'Outdoor Kitchens',
    revenue: 11300,
    partnerCost: 3200,
    materialCost: 1650,
    otherCost: 0
  },
  {
    projectId: 'PRJ-102',
    projectName: 'Triple Bin Storage Anthracite',
    customer: 'Sophia Taylor',
    category: 'Bin Storage',
    revenue: 1850,
    partnerCost: 520,
    materialCost: 300,
    otherCost: 0
  },
  {
    projectId: 'PRJ-103',
    projectName: 'Oak Wooden Canopy 6x4m',
    customer: 'Mark Davis',
    category: 'Canopies',
    revenue: 14500,
    partnerCost: 4500,
    materialCost: 2300,
    otherCost: 0
  },
  {
    projectId: 'PRJ-104',
    projectName: 'Luxury Terrace Decking',
    customer: 'Emma Wilson',
    category: 'Terraces',
    revenue: 8900,
    partnerCost: 2400,
    materialCost: 1200,
    otherCost: 0
  }
];

export const mockBankTransactions = [
  {
    id: 'TXN-9001',
    description: '50% Deposit Received - John Miller (INV-4001-A)',
    category: 'Sales / Revenue',
    type: 'Income',
    amount: '€ 5,650',
    numericAmount: 5650,
    date: getRelativeDate(12)
  },
  {
    id: 'TXN-9002',
    description: 'Payment Bin Storage - Sophia Taylor (INV-4002-A)',
    category: 'Sales / Revenue',
    type: 'Income',
    amount: '€ 1,850',
    numericAmount: 1850,
    date: getRelativeDate(8)
  },
  {
    id: 'TXN-9003',
    description: 'Purchase Teak Wood & Granite Slabs - CraftWood Veluwe',
    category: 'Material Purchasing',
    type: 'Expense',
    amount: '€ 2,400',
    numericAmount: 2400,
    date: getRelativeDate(6)
  },
  {
    id: 'TXN-9004',
    description: 'Payout Craftsman Advance - Erik van den Berg (CraftWood)',
    category: 'Subcontracting / Partner',
    type: 'Expense',
    amount: '€ 1,500',
    numericAmount: 1500,
    date: getRelativeDate(4)
  },
  {
    id: 'TXN-9005',
    description: 'Deposit Wooden Canopy - Mark Davis',
    category: 'Sales / Revenue',
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
