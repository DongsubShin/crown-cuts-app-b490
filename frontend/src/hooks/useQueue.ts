import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/api/booking.service';

export const useQueue = () => {
  const queryClient = useQueryClient();

  const queueQuery = useQuery({
    queryKey: ['queue'],
    queryFn: bookingService.getQueue,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const joinQueueMutation = useMutation({
    mutationFn: bookingService.joinQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });

  return {
    queue: queueQuery.data ?? [],
    isLoading: queueQuery.isLoading,
    joinQueue: joinQueueMutation.mutate,
  };
};