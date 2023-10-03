import { useCallback, useMemo, useState } from 'react';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Row, message } from 'antd';

import { Stock, StockModalType, StockSearchQuery, StocksParams, UpdateStock } from 'types/Stocks';
import { createStock, deleteStock, getStocks, updateStock } from 'api/stocks';
import { dollarFormatter, thousandFormatter } from 'utils';
import { format, fromUnixTime, getUnixTime } from 'date-fns';

export const useStock = () => {
  const queryClient = useQueryClient();

  const [isStockModalOpen, setIsStockModalOpen] = useState<StockModalType>();
  const [selectedStockModal, setSelectedStockModal] = useState<Stock>();
  const [tableParams, setTableParams] = useState<StocksParams>({
    pagination: { page: 1, limit: 5 },
    query: { query_item_name: '', query_item_supplier_name: '' },
  });

  const onOpenStockModal = (type: StockModalType) => {
    setIsStockModalOpen(type);
  };

  const onCloseStockModal = () => {
    setIsStockModalOpen(undefined);
  };

  // GET ALL RELATED ************************************************************************************************************************
  const onSubmitSearch = (value: StockSearchQuery) => {
    const searchPayload = tableParams;
    searchPayload.query = value;
    searchPayload.pagination = {
      page: 1,
      limit: 15,
    };
    setTableParams(searchPayload);
    refetchStocksList();
  };

  const fetchAllStocks = useCallback(async () => {
    return await getStocks({
      pagination: { page: tableParams.pagination.page, limit: tableParams.pagination.limit },
      query: {
        query_item_name: tableParams.query.query_item_name,
        query_item_supplier_name: tableParams.query.query_item_supplier_name,
      },
    });
  }, [tableParams]);

  const {
    isLoading: isLoadingStocksList,
    data: stocksList,
    refetch: refetchStocksList,
  } = useQuery({
    queryFn: fetchAllStocks,
    queryKey: ['stockList', tableParams],
    refetchOnWindowFocus: false,
    retry: false,
  });

  const stockDataSource: Stock[] = useMemo(() => {
    return stocksList?.data ?? [];
  }, [stocksList]);

  const stockColumns = [
    { title: 'Lot Number', dataIndex: 'lot_number', key: 'lot_number' },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => thousandFormatter(value.toString()),
    },
    {
      title: 'Price',
      dataIndex: 'buy_price',
      key: 'buy_price',
      render: (value: number) => dollarFormatter(value.toString()),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value: number) => (value ? format(new Date(fromUnixTime(value)), 'PP') : '-'),
    },
    {
      title: 'Expired Date',
      dataIndex: 'expired_date',
      key: 'expired_date',
      render: (value: number) => (value ? format(new Date(fromUnixTime(value)), 'PP') : '-'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, stock: Stock) => {
        return (
          <Row gutter={[8, 8]}>
            <Col>
              <Button
                shape='circle'
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStockModal(stock);
                  onOpenStockModal('update');
                }}
              />
            </Col>
            <Col>
              <Button
                shape='circle'
                danger
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStockModal(stock);
                  onOpenStockModal('delete');
                }}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  const onTableChange = (event: any) => {
    const paginationPayload = tableParams;
    paginationPayload.pagination = {
      page: event.current,
      limit: 5,
    };
    setTableParams(paginationPayload);
    refetchStocksList();
  };

  const createStockMutation = useMutation({
    mutationKey: ['stocksList'],
    mutationFn: (value: Stock) => {
      return createStock(value);
    },
    onSuccess: () => {
      message.success('Stock created!');
      refetchStocksList();
      onCloseStockModal();
      queryClient.invalidateQueries(['stocksList']);
    },
    onError: (e: any) => {
      const errorBE = e.response.data.error;
      message.error(`${errorBE}`);
    },
  });
  const updateStockMutation = useMutation({
    mutationKey: ['stocksList'],
    mutationFn: (value: UpdateStock) => {
      return updateStock(value.id, value);
    },
    onSuccess: () => {
      message.success('Stock updated!');
      refetchStocksList();
      onCloseStockModal();
      queryClient.invalidateQueries(['stocksList']);
    },
    onError: (e: any) => {
      const errorBE = e.response.data.error;
      message.error(`${errorBE}`);
    },
  });
  const deleteStockMutation = useMutation({
    mutationKey: ['stocksList'],
    mutationFn: (id: string) => {
      return deleteStock(id);
    },
    onSuccess: () => {
      message.success('Stock deleted!');
      refetchStocksList();
      onCloseStockModal();
      queryClient.invalidateQueries(['stocksList']);
    },
    onError: (e: any) => {
      const errorBE = e.response.data.error;
      message.error(`${errorBE}`);
    },
  });

  const onSubmitCreateStock = (value: Stock) => {
    const payload = { ...value, expired_date: getUnixTime(new Date(value?.expired_date ?? new Date())) };
    createStockMutation.mutate(payload);
  };

  const onSubmitUpdateStock = (value: Stock) => {
    const payload = {
      expired_date: value.expired_date ? getUnixTime(new Date(value?.expired_date ?? new Date())) : 0,
      quantity: value.quantity,
      id: value?.id ?? '',
    };
    updateStockMutation.mutate(payload);
  };
  const onSubmitDeleteStock = (value: Stock) => {
    deleteStockMutation.mutate(value?.id ?? '');
  };

  return {
    isLoadingStocksList,
    isLoadingSubmit: updateStockMutation.isLoading || createStockMutation.isLoading || deleteStockMutation.isLoading,
    isStockModalOpen,
    onCloseStockModal,
    onOpenStockModal,
    onSubmitCreateStock,
    onSubmitSearch,
    onSubmitUpdateStock,
    onTableChange,
    onSubmitDeleteStock,
    selectedStockModal,
    stockColumns,
    stockDataSource,
    stocksList,
    setSelectedStockModal,
  };
};
