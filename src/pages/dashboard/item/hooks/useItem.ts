import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Item, createItem, getAllItem } from 'api/items';
import { ItemTableParams, SearchQuery, TableDataProps } from '../types';

export const useItem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [tableParams, setTableParams] = useState<ItemTableParams>({
    pagination: { page: 1, limit: 5 },
    query: { item_name: '', item_supplier_name: '' },
  });

  const onRowClick = (record: TableDataProps) => {
    navigate(`/dashboard/item/${record.id}`);
  };

  const onSubmitSearch = (value: SearchQuery) => {
    const searchPayload = tableParams;
    searchPayload.query = value;
    searchPayload.pagination = {
      page: 1,
      limit: 15,
    };
    setTableParams(searchPayload);
    refetch();
  };

  const fetchItems = useCallback(async () => {
    return await getAllItem({
      pagination: { page: tableParams.pagination.page, limit: tableParams.pagination.limit },
      query: {
        item_name: tableParams.query?.item_name,
        item_supplier_name: tableParams.query?.item_supplier_name,
      },
    });
  }, [tableParams]);

  const {
    isLoading: isLoadingItemList,
    data,
    refetch,
  } = useQuery({
    queryFn: fetchItems,
    queryKey: ['itemList', tableParams],
    refetchOnWindowFocus: false,
    retry: false,
  });

  const dataSource: Item[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const columns = [
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    { title: 'Supplier Name', dataIndex: 'supplier_name', key: 'supplier_name' },
    { title: 'Serial Number', dataIndex: 'serial_number', key: 'serial_number' },
  ];

  const onTableChange = (event: any) => {
    const paginationPayload = tableParams;
    paginationPayload.pagination = {
      page: event.current,
      limit: 5,
    };
    setTableParams(paginationPayload);
    refetch();
  };

  const onOpenItemModal = () => {
    setIsItemModalOpen(true);
  };

  const onCloseItemModal = () => {
    setIsItemModalOpen(false);
  };

  const mutation = useMutation({
    mutationKey: ['itemList'],
    mutationFn: (value: Item) => {
      return createItem(value);
    },
    onSuccess: () => {
      message.success('Item added!');
      onCloseItemModal();
      queryClient.invalidateQueries(['itemList']);
    },
    onError: (e: any) => {
      const errorBE = e.response.data.error;
      message.error(`${errorBE}`);
    },
  });

  const onSubmitItemForm = (value: Item) => {
    mutation.mutate(value);
  };

  return {
    isItemModalOpen,
    isLoadingItemList,
    itemColumns: columns,
    itemDataSource: dataSource,
    metadata: data?.metadata,
    onCloseItemModal,
    onOpenItemModal,
    onRowClick,
    onSubmitItemForm,
    onSubmitSearch,
    onTableChange,
    tableParams,
  };
};
