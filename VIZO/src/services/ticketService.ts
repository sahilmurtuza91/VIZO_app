import {
  TicketCategory,
  CreateTicketPayload,
  TicketItem,
} from '../types/ticket';

let Ticket: TicketItem[] = [
  {
    id: '1',
    ticketNumber: '#12345',
    title: 'Technical Issue',
    description: 'App crashes when uploading property images',
    status: 'In Progress',
    timeAgo: 'Created 2 days ago',
    tabCategory: 'Active',
  },
  {
    id: '2',
    ticketNumber: '#24852',
    title: 'Notification Issue',
    description:
      'New client inquiry notifications are not appearing in the app.',
    status: 'In Progress',
    timeAgo: 'Created 3 hours ago',
    tabCategory: 'Active',
  },
  {
    id: '3',
    ticketNumber: '#24853',
    title: 'Upload Issue',
    description: 'Unable to upload property ownership documents.',
    status: 'Resolved',
    timeAgo: 'Created 5 hours ago',
    tabCategory: 'Inactive',
  },
];

export const ticketService = {
  getAllTicket: async (): Promise<TicketItem[]> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    return [...Ticket];
  },

  createTicket: async (Payload: CreateTicketPayload): Promise<TicketItem> => {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const newTicket: TicketItem = {
        id: Date.now().toString(),
        ticketNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
        title: Payload.issueType,
        description: Payload.description,
        status: "In Progress",
        timeAgo: "Created just now",
        tabCategory: "Active",
    };

    Ticket = [newTicket, ...Ticket];
    return newTicket;
  },
};
