import { create } from 'zustand';

const useAuctionStore = create((set) => ({
  triggerFetchTimestamp: null,
  setTriggerFetchTimestamp: () => set({ triggerFetchTimestamp: Date.now() }),
}));

export default useAuctionStore;
