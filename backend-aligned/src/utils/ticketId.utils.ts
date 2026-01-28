// Ticket ID Generator Utility

// Generate unique ticket ID in format TKT-YYYY-NNN
export const generateTicketId = async (lastTicketNumber: number = 0): Promise<string> => {
  const year = new Date().getFullYear();
  const nextNumber = lastTicketNumber + 1;
  const paddedNumber = String(nextNumber).padStart(3, '0');
  
  return `TKT-${year}-${paddedNumber}`;
};

// Generate technician code in format TCH-NNNN
export const generateTechnicianCode = async (lastTechNumber: number = 0): Promise<string> => {
  const nextNumber = lastTechNumber + 1;
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  return `TCH-${paddedNumber}`;
};

// Parse ticket ID to extract year and number
export const parseTicketId = (ticketId: string): { year: number; number: number } | null => {
  const match = ticketId.match(/^TKT-(\d{4})-(\d{3})$/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1], 10),
    number: parseInt(match[2], 10),
  };
};
