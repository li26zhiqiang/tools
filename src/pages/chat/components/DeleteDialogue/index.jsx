import React from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { chatAsync } from '@/store/async';
import { generateUUID } from '@utils/generateUUID';

export default function DeleteDialogue(props) {
    function resetChats(chats, setChats, item) {
        let arr = chats.filter((chat) => {
            return chat.id !== item.id;
        });

        if (arr.length === 0) {
            const uuid = generateUUID();
            arr = [
                {
                    id: `new-dialogue-${uuid}`,
                    name: '新建对话',
                    path: `new-dialogue-${uuid}`,
                    data: []
                }
            ];
            props.setSelectChatId(`new-dialogue-${uuid}`);
        }
        setChats(arr);
    }

    async function delDialogue() {
        const { setChats, chats, item } = props;

        //  判断是新建对话还是老对话
        if (props.item.id.includes('new-dialogue')) {
            resetChats(chats, setChats, item);
            return;
        }

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
