import VIPApi from 'api';
import { Supplier } from 'types/SupplierAddress';

export interface GetAllSupplierAddressParams {
  pagination: {
    limit: number;
    page: number;
  };
  query: {
    query_item_supplier_name: string;
  };
}

export const getAllSupplierAddress = async ({ pagination, query }: GetAllSupplierAddressParams) => {
  const { page = 1, limit = 5 } = pagination;
  const { query_item_supplier_name = '' } = query;
  const filter = query_item_supplier_name ? `&query_item_supplier_name=${query_item_supplier_name}` : '';
  const response = await VIPApi.get(`supplier_addresses?page=${page}&limit=${limit}${filter}`);
  return response.data;
};

export const createSupplierAddress = async (payload: Supplier) => {
  const response = await VIPApi.post('supplier_addresses', payload);
  return response.data;
};

export const updateSupplierAddress = async (payload: Supplier, id: string) => {
  const response = await VIPApi.put(`supplier_addresses/${id}`, payload);
  return response.data;
};

export const deleteSupplierAddress = async (id: string) => {
  const response = await VIPApi.delete(`supplier_addresses/${id}`);
  return response.data;
};
