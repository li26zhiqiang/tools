import React, { useState } from 'react';
import { Button } from 'antd';
import { cloneDeep } from 'lodash';
import { generateUUID } from '@utils/generateUUID';
import { chatAsync } from '@/store/async';

export default function CreateChat(props) {
    const { chats, setChats, setSelectChatId } = props;
    const [loading, setLoading] = useState(false);

    async function createChat() {
        try {
            setLoading(true);
            const params = {
                chatName: '新建对话'
            };
            const resp = await chatAsync.newDialogue(params);

            if (resp) {
                //  刷新对话列表
                props.getChatMessage();
            }
        } catch (err) {
            //
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            block
            type="dashed"
            loading={loading}
            style={{
                marginBottom: 6,
                marginLeft: 0,
                marginRight: 0
            }}
            onClick={() => {
                createChat();
            }}
        >
            新建对话
        </Button>
    );
}
