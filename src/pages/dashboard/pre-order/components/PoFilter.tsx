import { Col, Form, Input, Row } from 'antd';
import { VIPButton } from 'components/button';
import { SearchQuery } from 'types/types';

interface PoFilterProps {
  onSubmit: (value: SearchQuery) => void;
}

export const PoFilter = ({ onSubmit }: PoFilterProps) => {
  return (
    <Form onFinish={onSubmit} layout='inline' className='p-0 my-3 w-full flex flex-col justify-center items-center'>
      <Row justify='start' align='middle' gutter={[12, 12]} className='w-full'>
        <Col lg={6} md={12} xs={24}>
          <Form.Item className='w-full' name='item_supplier_name'>
            <Input className='w-full' placeholder='Supplier Name' size='large' />
          </Form.Item>
        </Col>
        <Col lg={6} md={6} xs={24}>
          <Form.Item className='p-0 m-0 w-full'>
            <VIPButton className='w-full md:w-32' size='large' type='primary' htmlType='submit'>
              Search
            </VIPButton>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
