import React, { useState } from 'react';
import { FormOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Form, Input } from 'antd';
import { chatAsync } from '@/store/async';

export default function EditDialogue(props) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function showModal() {
        setVisible(true);
    }

    function cancelModal() {
        setVisible(false);
        form.resetFields();
    }

    async function submit() {
        const values = await form.getFieldValue();

        if (values) {
            if (props?.id && props?.id.includes('new-dialogue')) {
                const { chats } = props;
                const arr = chats.map((item) => {
                    if (item.id === props.id) {
                        item.name = values?.name;
                    }
                    return item;
                });
                props.setChats(arr);
                cancelModal();
                return;
            }

            setLoading(true);
            const params = {
                chatId: props?.id,
                name: values.name
            };
            const resp = await chatAsync.editUserDialogueTitle(params);
            setLoading(false);

            if (resp) {
                cancelModal();
                props.refresh();
            }
        }
    }

    return (
        <>
            <Tooltip title="编辑">
                <FormOutlined onClick={() => showModal()} />
            </Tooltip>
            <Modal
                title="编辑"
                open={visible}
                onOk={submit}
                onCancel={cancelModal}
                confirmLoading={loading}
                okText="确认"
                cancelText="取消"
            >
                <Form form={form}>
                    <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                        <Input autoComplete={'off'} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
