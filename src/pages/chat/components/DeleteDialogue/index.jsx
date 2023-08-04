import React from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { chatAsync } from '@/store/async';

export default function DeleteDialogue(props) {
    async function delDialogue() {
        const param = {
            id: props.item.id,
            name: props.item.name
        };

        const resp = await chatAsync.delUserDialogue(param);

        if (resp) {
            props.refresh();
        }
    }

    return (
        <Popconfirm
            title="删除会话"
            description="是否确定删除会话？"
            onConfirm={() => delDialogue()}
            okText="确定"
            cancelText="取消"
        >
            <DeleteOutlined />
        </Popconfirm>
    );
}
