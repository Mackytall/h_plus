import { useSecureQuery } from './useQuery';
import { reactQueryKeys } from '../constants/reactQueryKeys';
import { urls } from '../configurations';
import { useQueryClient, useMutation } from 'react-query';
import { fetchSecure } from '../helper/fetchHelper';
import { CreateCustomer, ICustomer } from "../types/customer";
import { SuccessResponse } from '../types/responses';

const customersUrl = `${urls.auth}/customers`

export const useCreateCustomer = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: SuccessResponse | null) => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const createFridge = useMutation(
    ({ customer }: { customer: CreateCustomer }) =>
      fetchSecure<SuccessResponse>(`${customersUrl}`, {
        method: 'POST',
        body: JSON.stringify(customer),
        throwOnError: true,
        secure: true,
      }),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(reactQueryKeys.customers);
        onSuccess(res.data);
      },
      onError: (error) => {
        onError(error);
      },
    }
  );
  return createFridge;
};
export const useCustomers = () => 
  useSecureQuery<ICustomer[]>(reactQueryKeys.customers, {
    url: `${customersUrl}/all`,
    path: 'data.customers',
    method: 'GET',  })
