export type TicketStatus = 'In Progress' | 'Resolved';
export type TicketCategory = 'Active' | 'Inactive';

export interface TicketItem {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  timeAgo: string;
  tabCategory: TicketCategory;
}

export interface CreateTicketPayload {
  issueType: string;
  description: string;
}