import { Form, Input, InputNumber, Modal } from 'antd';
import { VIPButton } from 'components/button';
import { useEffect } from 'react';
import { Customer } from 'types/Customer';

interface EditCustomerModalProps {
  isOpen: boolean;
  onSubmit: (value: Customer) => void;
  onCancel: () => void;
  data: Customer;
}

export const EditCustomerModal = ({ data, isOpen, onSubmit, onCancel }: EditCustomerModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const initData = () => {
      form.setFieldsValue({ ...data, id: data.id });
    };
    initData();
  }, [form, data]);

  return (
    <Modal width={300} footer={false} title='Update Customer' open={isOpen} onCancel={onCancel}>
      <Form
        form={form}
        name='edit-customer-form'
        requiredMark={false}
        onFinish={onSubmit}
        className='mt-3'
        layout='vertical'
      >
        <Form.Item
          className='hidden mb-5'
          label='id'
          name='id'
          rules={[{ required: true, message: 'Input customer id!' }]}
        >
          <Input size='large' placeholder='Input customer id' />
        </Form.Item>
        <Form.Item
          className='mb-5'
          label='Customer Name'
          name='name'
          rules={[{ required: true, message: 'Input customer name!' }]}
        >
          <Input size='large' placeholder='Input customer name' />
        </Form.Item>
        <Form.Item
          className='mb-5'
          label='Payment Term'
          name='payment_term'
          rules={[{ required: true, message: 'Input payment term!' }]}
        >
          <InputNumber className='w-full' size='large' placeholder='Input payment term' />
        </Form.Item>
        <Form.Item
          className='mb-5'
          label='Address'
          name='address'
          rules={[{ required: true, message: 'Input customer address!' }]}
        >
          <Input size='large' placeholder='Input customer address' />
        </Form.Item>
        <Form.Item
          className='mb-5'
          label='Invoice Address'
          name='invoice_address'
          rules={[{ required: true, message: 'Input invoice address!' }]}
        >
          <Input size='large' placeholder='Input invoice address' />
        </Form.Item>

        <Form.Item>
          <VIPButton size='large' className='w-full' htmlType='submit'>
            Update
          </VIPButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};