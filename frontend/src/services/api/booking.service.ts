import apiClient from './api-client';
import { Booking, Service, QueueEntry } from '../../types';

export const bookingService = {
  getServices: async (): Promise<Service[]> => {
    const { data } = await apiClient.get('/services');
    return data;
  },
  
  getQueue: async (): Promise<QueueEntry[]> => {
    const { data } = await apiClient.get('/queue/live');
    return data;
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const { data } = await apiClient.post('/bookings', bookingData);
    return data;
  },

  joinQueue: async (entry: Partial<QueueEntry>): Promise<QueueEntry> => {
    const { data } = await apiClient.post('/queue/join', entry);
    return data;
  }
};