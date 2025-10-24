import { useMutation, useQuery } from '@tanstack/react-query';
import { useAxios } from '../../axios/axios';
import type { Service, ServiceCreateOrUpdateData } from '../../entities/service';
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar';
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup';
import { getServices, postCreateOrUpdateService } from './api';

export const useServicesQuery = () => {
  const axios = useAxios();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => getServices(axios),
  });
};

export const useCreateNewOrUpdateServiceMutation = () => {
  const axios = useAxios();
  const addSnackBarMessage = useAddSnackbarMessage();

  return useMutation<ServiceCreateOrUpdateData, Error, ServiceCreateOrUpdateData>({
    mutationFn: (serviceData: ServiceCreateOrUpdateData) =>
      postCreateOrUpdateService(axios, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      addSnackBarMessage({ text: 'Služba byla upravena nebo přidána do ceníku.', type: 'success' });
    },

    onError: error => {
      addSnackBarMessage({ text: error.message, type: 'error' });
      console.error(error);
    },
  });
};
