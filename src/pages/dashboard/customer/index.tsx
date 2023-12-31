import { Table } from 'antd';

import { VIPButton } from 'components/button';
import { PageTitle } from 'components/page-title';
import { useCustomer } from './hooks/useCustomer';
import { CreateCustomerModal } from './components/CreateCustomerModal';
import { CustomerFilter } from './components/CustomerFilter';
import { EditCustomerModal } from './components/EditCustomerModal';

export const Customer = () => {
  const {
    columns,
    customerList,
    dataSource,
    isCreateCustomerModalOpen,
    isLoadingCustomerList,
    isLoadingSubmit,
    isUpdateCustomerModalOpen,
    onClickCloseCustomerModal,
    onClickCloseUpdateCustomerModal,
    onClickOpenCustomerModal,
    onRowClick,
    onSubmitCreateCustomer,
    onSubmitSearch,
    onSubmitUpdateCustomer,
    onTableChange,
    selectedCustomerUpdate,
  } = useCustomer(5);

  return (
    <div className='h-[1000px]'>
      <PageTitle
        title='Customer'
        rightNode={
          <VIPButton size='large' onClick={onClickOpenCustomerModal}>
            Create Customer
          </VIPButton>
        }
      />
      <CustomerFilter onSubmit={onSubmitSearch} />

      <Table
        scroll={{ x: 300 }}
        onChange={onTableChange}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        rowKey='id'
        className='mt-3'
        dataSource={dataSource}
        columns={columns}
        loading={isLoadingCustomerList}
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
          total: customerList?.metadata.total_items,
        }}
      />
      <EditCustomerModal
        isLoadingSubmit={isLoadingSubmit}
        isOpen={isUpdateCustomerModalOpen}
        onCancel={onClickCloseUpdateCustomerModal}
        data={selectedCustomerUpdate}
        onSubmit={onSubmitUpdateCustomer}
      />
      <CreateCustomerModal
        isLoadingSubmit={isLoadingSubmit}
        isOpen={isCreateCustomerModalOpen}
        onCancel={onClickCloseCustomerModal}
        onSubmit={onSubmitCreateCustomer}
      />
    </div>
  );
};
