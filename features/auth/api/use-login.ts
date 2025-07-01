import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { RandomUserResponse , User } from '@/features/auth/types/user';

const fetchRandomUser = async (): Promise<User> => {
  const response = await axios.get<RandomUserResponse>('https://randomuser.me/api/', {
    params: { results: 1, nat: 'us' },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch random user');
  }

  return response.data.results[0];
};

export const useLogin = () => {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: fetchRandomUser,
    staleTime: 1000 * 60 * 10, 
    enabled: false,
    retry: false,
  });
};
