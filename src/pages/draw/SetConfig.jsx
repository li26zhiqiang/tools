import React, { useState } from 'react';
import { Select, Button, Modal, Form } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export default function SetConfig(props) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { setDrawResultData, drawResultData } = props;

    function cancel() {
        setVisible(false);
        form.setFieldsValue({
            size: '1024*1024',
            imageNums: '1'
        });
    }

    function showModal() {
        setVisible(true);
        form.setFieldsValue({
            size: '1024*1024',
            imageNums: '1'
        });
    }

    async function submit() {
        const values = await form.getFieldValue();

        setDrawResultData({
            ...drawResultData,
            quantity: values?.imageNums,
            width: values.size.split('*')[0],
            height: values.size.split('*')[1]
        });

        setVisible(false);
    }

    return (
        <>
            <Button onClick={() => showModal()} icon={<SettingOutlined />}></Button>
            <Modal
                open={visible}
                onCancel={cancel}
                title="配置图片参数"
                onOk={submit}
                confirmLoading={loading}
                okText="确认"
                cancelText="取消"
            >
                <Form form={form}>
                    <Form.Item name="size" label="图片大小" rules={[{ required: true }]}>
                        <Select placeholder="请选择">
                            <Option value="1024*1024">1024 * 1024</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="imageNums" label="出图数量" rules={[{ required: true }]}>
                        <Select placeholder="请选择">
                            <Option value="1">1</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
