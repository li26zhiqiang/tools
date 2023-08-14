import {
    updatePictureFun,
    getUserMessages,
    createDialogue,
    delUserMessages,
    editDialogueTitle,
    editPicture,
    newDialogueFun,
    getUserQuotaFun,
    historyPicFun
} from '@/request/api';

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

// async function fetchDelUserMessages(params: { id?: string | number; type: string }) {
//     const res = await delUserMessages({ chatId: params.id });

//     // if (!res.code) {
//     //     if (params.type === 'clear' && params.id) {
//     //         chatStore.getState().clearChatMessage(params.id);
//     //     } else if (params.type === 'del' && params.id) {
//     //         chatStore.getState().delChat(params.id);
//     //     } else if (params.type === 'delAll') {
//     //         chatStore.getState().clearChats();
//     //     }
//     // }

//     return res;
// }

//  点击发送
async function sendChatMessages(params: { chatName?: string; message?: object; model?: string }) {
    const resp = await createDialogue(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

// 删除对话
async function delUserDialogue(params: { id?: string | number; name: string }) {
    const resp = await delUserMessages({ chatId: params.id, name: params.name });

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  编辑对话标题
async function editUserDialogueTitle(params: { chatId: string | number; name: string }) {
    const resp = await editDialogueTitle(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  获取图片
async function getPicture(params: { prompt: string; imageNums: number; size: string }) {
    const resp = await editPicture(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  编辑图片
async function updatePicture(params: any) {
    const resp = await updatePictureFun(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  创建对话
async function newDialogue(params: any) {
    const resp = await newDialogueFun(params);

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  获取用户当前配额
async function getUserQuota() {
    const resp = await getUserQuotaFun();

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

//  获取用户历史图片
async function getUserHistoryPic() {
    const resp = await historyPicFun();

    if (resp.code && resp.code === 200) {
        return resp?.data;
    }
}

export default {
    getUserHistoryPic,
    getUserQuota,
    newDialogue,
    createDialogue,
    fetchChatMessages,
    // fetchDelUserMessages,
    sendChatMessages,
    delUserDialogue,
    editUserDialogueTitle,
    getPicture,
    updatePicture
};
