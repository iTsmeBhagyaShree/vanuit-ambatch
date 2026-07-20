export const mockLeads = [
  { id: 'L-1001', name: 'Jan de Vries', company: 'De Vries BV', phone: '+31 6 12345678', email: 'jan@devries.nl', status: 'New', assignedTo: 'Admin', date: '2023-10-15' },
  { id: 'L-1002', name: 'Pieter Bakker', company: 'Bakker & Zonen', phone: '+31 6 87654321', email: 'pieter@bakker.nl', status: 'Contacted', assignedTo: 'Admin', date: '2023-10-16' },
  { id: 'L-1003', name: 'Sanne Visser', company: '-', phone: '+31 6 11223344', email: 'sanne@example.com', status: 'Qualified', assignedTo: 'Admin', date: '2023-10-17' },
  { id: 'L-1004', name: 'Kees Janssen', company: 'Janssen Groep', phone: '+31 6 44556677', email: 'kees@janssen.nl', status: 'New', assignedTo: 'Admin', date: '2023-10-18' },
  { id: 'L-1005', name: 'Lotte van Berg', company: '-', phone: '+31 6 33221100', email: 'lotte@gmail.com', status: 'Contacted', assignedTo: 'Admin', date: '2023-10-19' },
];

export const mockProjects = [
  { id: 'P-2001', name: 'Luxury Outdoor Kitchen Amsterdam', customer: 'Jan de Vries', partner: 'Sven Hoek', progress: 45, deadline: '2023-12-01', status: 'In Progress' },
  { id: 'P-2002', name: 'Garden Lounge Set Rotterdam', customer: 'Pieter Bakker', partner: 'Lars Jansen', progress: 100, deadline: '2023-11-15', status: 'Completed' },
  { id: 'P-2003', name: 'Custom Stone BBQ Utrecht', customer: 'Sanne Visser', partner: 'Unassigned', progress: 0, deadline: '2024-01-10', status: 'Pending' },
  { id: 'P-2004', name: 'Outdoor Living Room Haarlem', customer: 'Kees Janssen', partner: 'Sven Hoek', progress: 70, deadline: '2023-11-30', status: 'In Progress' },
];

export const mockPartners = [
  { id: 'PT-3001', name: 'Sven Hoek', company: 'Hoek Bouw', email: 'sven@hoekbouw.nl', phone: '+31 6 99887766', projects: 2, status: 'Active' },
  { id: 'PT-3002', name: 'Lars Jansen', company: 'Jansen Houtwerk', email: 'lars@jansen.nl', phone: '+31 6 55443322', projects: 1, status: 'Active' },
  { id: 'PT-3003', name: 'Theo Mulder', company: 'Mulder Tuinen', email: 'theo@mulder.nl', phone: '+31 6 77889900', projects: 3, status: 'Active' },
  { id: 'PT-3004', name: 'Emma Boer', company: 'Boer Ontwerp', email: 'emma@boer.nl', phone: '+31 6 22334455', projects: 0, status: 'Inactive' },
];

export const mockQuotes = [
  { id: 'Q-4001', customer: 'Jan de Vries', project: 'Luxury Outdoor Kitchen', amount: '€ 12,500', status: 'Accepted', date: '2023-10-18' },
  { id: 'Q-4002', customer: 'Pieter Bakker', project: 'Garden Lounge Set', amount: '€ 4,200', status: 'Paid', date: '2023-10-20' },
  { id: 'Q-4003', customer: 'Sanne Visser', project: 'Custom Stone BBQ', amount: '€ 8,900', status: 'Draft', date: '2023-10-22' },
  { id: 'Q-4004', customer: 'Kees Janssen', project: 'Outdoor Living Room', amount: '€ 15,750', status: 'Accepted', date: '2023-10-24' },
  { id: 'Q-4005', customer: 'Lotte van Berg', project: 'Patio Upgrade', amount: '€ 3,400', status: 'Draft', date: '2023-10-25' },
];

export const mockRecentActivities = [
  { id: 1, text: 'Quote Q-4001 accepted by Jan de Vries', time: '2 hours ago' },
  { id: 2, text: 'Project P-2004 progress updated to 70%', time: '4 hours ago' },
  { id: 3, text: 'Project P-2001 assigned to Sven Hoek', time: '5 hours ago' },
  { id: 4, text: 'New lead from Sanne Visser received', time: '1 day ago' },
  { id: 5, text: 'Invoice Q-4002 marked as Paid', time: '2 days ago' },
];
