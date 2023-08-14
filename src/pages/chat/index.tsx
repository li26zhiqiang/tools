import React, { useEffect, useState, useRef, useMemo } from 'react';
import useSmoothScroll from 'react-smooth-scroll-hook';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from './index.module.less';
import Layout from '@/components/Layout';
import { CommentOutlined } from '@ant-design/icons';
import { chatAsync } from '@/store/async';
import ChatMessage from './components/ChatMessage';
import Reminder from '@/components/Reminder';
import useMobile from '@/hooks/useMobile';
import AllInput from './components/AllInput';
import { ChatGpt } from '@/types';
import { configStore } from '@/store';
import { generateUUID } from '@utils/generateUUID';
import EditDialogue from './components/EditDialogue';
import DeleteDialogue from './components/DeleteDialogue';
import CreateChat from './components/CreateChat';
import SelectGPTType from './components/SelectGPTType';

export default function ChatPage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const [chats, setChats] = useState<any>([]);
    const [selectChatId, setSelectChatId] = useState<any>(null);
    const [fetchController, setFetchController] = useState<any>(null);
    const { config, models, changeConfig, setConfigModal } = configStore();
    const [scrollItem, setScrollItem] = useState<any>(null);
    const [containerOneView, setContainerOneView] = useState(300);
    const [gptType, setGptType] = useState<any>(null);

    const { scrollTo } = useSmoothScroll({
        ref: scrollRef,
        speed: 300,
        direction: 'y'
    });

    //  刷新chats
    async function getChatMessage() {
        const resp = await chatAsync.fetchChatMessages();

        if (resp && resp.length !== 0) {
            const arr = resp.map((item: any) => {
                return {
                    id: item?.chatId,
                    name: item?.chatName,
                    path: item?.chatId,
                    data: item.messageList.map((msg: any) => {
                        return {
                            id: msg.id,
                            role: msg.role,
                            text: msg.content,
                            dateTime: moment(msg.createTime).format('YYYY/MM/DD hh:mm:ss'),
                            requestOptions: {
                                options: {
                                    model: config.model
                                },
                                prompt: msg.content
                            }
                        };
                    })
                };
            });

            if (arr.length > 0) {
                const id = arr[0]?.id;
                setSelectChatId(id);
                commonSetScroll(arr, id);
            }

            setChats(arr);
        } else if (resp && resp.length === 0) {
            const uuid = generateUUID();
            setScrollItem(null);
            setChats([
                {
                    id: `new-dialogue-${uuid}`,
                    name: '新建对话',
                    path: `new-dialogue-${uuid}`,
                    data: []
                }
            ]);
            setSelectChatId(`new-dialogue-${uuid}`);
        }
    }

    function getDialogueItem(param: { timestamp: any; value: any }) {
        const { timestamp, value } = param;
        const userId = generateUUID();
        const assistantId = generateUUID();

        return {
            dialogueArr: [
                {
                    id: userId,
                    dateTime: timestamp,
                    requestOptions: {
                        options: {
                            model: config.model
                        },
                        prompt: value
                    },
                    role: 'user',
                    status: 'pass',
                    text: value
                },
                {
                    id: assistantId,
                    dateTime: timestamp,
                    requestOptions: {
                        options: {
                            model: config.model
                        },
                        prompt: ''
                    },
                    role: 'assistant',
                    status: 'loading',
                    text: ''
                }
            ],
            dialogueId: assistantId
        };
    }

    async function getDialogue(value: string, type: string) {
        let assistantId: any = null;
        const chatArr = cloneDeep(chats).map((item: any) => {
            let timestamp = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');

            if (type === 'new' && item.id === selectChatId) {
                const { dialogueArr, dialogueId } = getDialogueItem({ timestamp, value });
                const dialogueItem: any = dialogueArr;
                assistantId = dialogueId;
                item.data = [...dialogueItem];
            } else if (type === 'old' && item.id === selectChatId) {
                const { dialogueArr, dialogueId } = getDialogueItem({ timestamp, value });
                const dialogueItem: any = dialogueArr;
                assistantId = dialogueId;
                item.data = [...item.data, ...dialogueItem];
            }

            return item;
        });

        commonSetScroll(chatArr, null);
        setChats(chatArr);
        setFetchController(true);
        const dialogue = chatArr.filter((item: any) => item.id === selectChatId)[0];
        const params = {
            message: { role: 'user', content: value },
            model: gptType
        };

        if (type === 'new') {
            params['chatName'] = dialogue?.name || '';
        } else {
            params['chatId'] = dialogue?.id;
        }

        let resp: any = {};
        resp = await chatAsync.sendChatMessages(params);

        setFetchController(false);
        if (resp) {
            //  如果是新对话
            const arr = chatArr.map((item: any, index: any) => {
                let timestamp = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');

                if (item.id === selectChatId) {
                    if (type === 'new') {
                        item.id = resp.chatId;
                        item.path = resp.chatId;
                    }

                    item.data = cloneDeep(item.data).map((dialogueRecord: any) => {
                        if (dialogueRecord.id === assistantId) {
                            return {
                                dateTime: timestamp,
                                id: generateUUID(),
                                requestOptions: {
                                    options: {
                                        model: config.model
                                    },
                                    prompt: value
                                },
                                role: 'assistant',
                                status: 'pass',
                                text: resp?.message
                            };
                        }

                        return dialogueRecord;
                    });
                }
                return item;
            });

            setSelectChatId(resp.chatId);
            commonSetScroll(arr, null);
            setChats(arr);
        }
    }

    // 对话
    async function sendChatCompletions(value: string, refurbishOptions?: ChatGpt) {
        const dialogue = chats.filter((c: any) => c.id === selectChatId)[0];

        //  判断，新建对话---里面是否有
        const isNewDialogue = dialogue.id.includes('new-dialogue');

        if (isNewDialogue) {
            getDialogue(value, 'new');
        } else {
            getDialogue(value, 'old');
        }
    }

    // 当前聊天记录
    const chatMessages = useMemo(() => {
        const chatList = chats.filter((c: any) => c.id === selectChatId);

        return chatList.length <= 0 ? [] : chatList[0].data;
    }, [selectChatId, chats]);

    function commonSetScroll(arr: any, id: any) {
        const selectTalkId = id || selectChatId;
        const selectItem = arr.filter((item: any) => item.id === selectTalkId);

        if (selectItem.length > 0 && selectItem[0].data && selectItem[0].data.length > 0) {
            setScrollItem(`#item-${selectItem[0].data.length - 1}`);
        }
    }

    useEffect(() => {
        getChatMessage();
    }, []);

    useEffect(() => {
        if (scrollItem) {
            scrollTo(`${scrollItem}`);
        }
    }, [scrollItem, selectChatId]);

    useEffect(() => {
        if (viewRef?.current) {
            setContainerOneView(viewRef.current.offsetHeight - 80);
        }
    }, [viewRef]);

    return (
        <div className={styles.chatPage}>
            <Layout
                menuExtraRender={() => <CreateChat {...{ setChats, setSelectChatId, chats, getChatMessage }} />}
                route={{ path: '/', routes: chats }}
                menuFooterRender={(props) => {
                    return <SelectGPTType {...{ gptType, setGptType }} />;
                }}
                menuProps={{
                    onClick: (r) => {
                        const id = r.key.replace('/', '');

                        if (selectChatId !== id) {
                            setSelectChatId(id);
                        }
                    }
                }}
                menuItemRender={(item, dom) => {
                    const className =
                        item.id === selectChatId ? `${styles.menuItem} ${styles.menuItem_action}` : styles.menuItem;

                    return (
                        <div className={className}>
                            <span className={styles.menuItem_icon}>
                                <CommentOutlined />
                            </span>
                            <span className={styles.menuItem_name}>{item.name}</span>
                            <div className={styles.menuItem_options}>
                                <EditDialogue
                                    {...item}
                                    chats={chats}
                                    setChats={setChats}
                                    refresh={() => getChatMessage()}
                                />
                                <DeleteDialogue
                                    {...{
                                        item,
                                        chats,
                                        setChats,
                                        setSelectChatId,
                                        refresh: () => getChatMessage()
                                    }}
                                />
                            </div>
                        </div>
                    );
                }}
            >
                <div className={styles.chatPage_container}>
                    <div className={styles.chatPage_container_one} ref={viewRef}>
                        <div
                            id="image-wrapper"
                            style={{
                                overflowY: 'scroll',
                                maxHeight: `${containerOneView}px`
                            }}
                            ref={scrollRef}
                        >
                            {chatMessages.map((item: any, index: any) => {
                                return (
                                    <div id={`item-${index}`} key={index}>
                                        <ChatMessage
                                            key={item.dateTime + item.role + item.text}
                                            position={item.role === 'user' ? 'right' : 'left'}
                                            status={item.status}
                                            content={item.text}
                                            time={item.dateTime}
                                            model={item.requestOptions.options?.model}
                                        />
                                    </div>
                                );
                            })}
                            {chatMessages.length <= 0 && <Reminder />}
                            <div style={{ height: 80 }} />
                        </div>
                    </div>
                    <div
                        className={styles.chatPage_container_two}
                        style={{
                            position: isMobile ? 'fixed' : 'absolute'
                        }}
                    >
                        <AllInput
                            disabled={Boolean(fetchController)}
                            onSend={(value) => {
                                if (value.startsWith('/')) {
                                    return;
                                }

                                sendChatCompletions(value);
                            }}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
}
