import { Col, Form, Input, Row } from 'antd';
import { VIPButton } from 'components/button';
import { StockSearchQuery } from 'types/Stocks';

interface StockFilterProps {
  onSubmit: (value: StockSearchQuery) => void;
}

export const StockFilter = ({ onSubmit }: StockFilterProps) => {
  return (
    <Form onFinish={onSubmit} layout='inline' className='p-0 my-3 w-full flex flex-col justify-center items-center'>
      <Row justify='start' align='middle' gutter={[12, 12]} className='w-full'>
        <Col lg={12} md={12} xs={24}>
          <Row className='p-0 m-0' gutter={[12, 12]}>
            <Col xs={24} md={12} className='p-0 m-0'>
              <Form.Item className='w-full' name='query_item_supplier_name'>
                <Input className='w-full' placeholder='Supplier Name' size='large' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} className='p-0 m-0'>
              <Form.Item className='w-full' name='query_item_name'>
                <Input className='w-full' placeholder='Item Name' size='large' />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col className='p-0 m-0' lg={12} md={6} xs={24}>
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
