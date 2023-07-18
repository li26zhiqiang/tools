import { delUserMessages, getUserMessages, createDialogue } from '@/request/api';
import chatStore from './slice';
import async from '../draw/async';

function convertChatInfos(data: Record<string, any>) {
    return data.map((item: Record<string, any>) => {
        const { chat_id, name, message_list } = item;

        return {
            path: chat_id,
            id: chat_id,
            name: name || chat_id,
            data: message_list.map((record: Record<string, any>, index: number) => {
                const { role, content } = record;
                return {
                    role,
                    text: content,

                    id: String(index),
                    dateTime: '',
                    status: 'pass',
                    requestOptions: {}
                };
            })
        };
    });
}

async function fetchChatMessages() {
    const res = await getUserMessages();

    if (res.code && res.code === 200) {
        return res?.data || [];
    }
}

async function fetchDelUserMessages(params: { id?: string | number; type: string }) {
    const res = await delUserMessages({ chatId: params.id });

    if (!res.code) {
        if (params.type === 'clear' && params.id) {
            chatStore.getState().clearChatMessage(params.id);
        } else if (params.type === 'del' && params.id) {
            chatStore.getState().delChat(params.id);
        } else if (params.type === 'delAll') {
            chatStore.getState().clearChats();
        }
    }

    return res;
}

//  点击发送
async function sendChatMessages(params: { chatName?: string; message?: object; model?: string }) {
    const resp = await createDialogue(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

export default {
    fetchChatMessages,
    fetchDelUserMessages,
    sendChatMessages
};
