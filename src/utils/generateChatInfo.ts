import { ChatsInfo } from '@/types';
import { generateUUID } from './generateUUID';

export function generateChatInfo(): ChatsInfo {
    const uuid = generateUUID();
    return {
        path: `new-dialogue-${uuid}`,
        id: `new-dialogue-${uuid}`,
        name: '新的对话',
        data: []
    };
}
