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
    method: 'GET',
  })

export const saveImage = async (image: FormData) => {
  const response = await fetch(`${customersUrl}/bucket/image`, {
    method: 'POST',
    body: image,
  });

  const result = await response.json();

  return result;
};

export const useCustomer = (id: string | undefined ) =>
  useSecureQuery<ICustomer>([reactQueryKeys.customers, id], {
    url: `${customersUrl}/${id}`,
    method: 'GET',
    path: 'data.customer',
    secure: true,
    enabled: !!id && id !== 'null' && id !== 'undefined',
  })

  export const useUpdateCustomer = ({
    onSuccess,
    onError,
    id,
  }: {
    onSuccess: (data: SuccessResponse | null) => void;
    onError: (error: any) => void;
    id: ICustomer['_id'];
  }) => {
    const queryClient = useQueryClient();
    const updateCustomer = useMutation(
      ({ customer, id }: { customer: Partial<ICustomer>; id: ICustomer['_id'] }) =>
        fetchSecure<SuccessResponse>(`${customersUrl}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(customer),
          throwOnError: true,
          secure: true,
          specifyTypeContent: true,
        }),
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries(reactQueryKeys.customers);
          queryClient.invalidateQueries([reactQueryKeys.customers, id]);
          onSuccess(res.data);
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
    return updateCustomer;
  };