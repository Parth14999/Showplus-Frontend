import { create } from 'zustand';

export const useSeatStore = create((set, get) => ({
  selectedSeats: [], // Array of selected seat codes, e.g. ['A1', 'A2']
  
  // Seat Pricing Tiers
  seatPrices: {
    VIP: 500,
    Premium: 300,
    General: 150,
  },

  // Toggle seat selection
  toggleSeat: (seatId) => {
    const { selectedSeats } = get();
    if (selectedSeats.includes(seatId)) {
      set({ selectedSeats: selectedSeats.filter((id) => id !== seatId) });
    } else {
      set({ selectedSeats: [...selectedSeats, seatId] });
    }
  },

  // Calculate total price based on selected seat rows
  getTotalPrice: () => {
    const { selectedSeats, seatPrices } = get();
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId[0]; // First character (A, B, C, D...)
      if (row === 'A' || row === 'B') return total + seatPrices.VIP;
      if (row === 'C' || row === 'D') return total + seatPrices.Premium;
      return total + seatPrices.General;
    }, 0);
  },

  clearSeats: () => set({ selectedSeats: [] }),
}));