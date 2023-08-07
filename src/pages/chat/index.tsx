import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Modal, Popconfirm, Space, Tabs, Select, message } from 'antd';
import styles from './index.module.less';
import Layout from '@/components/Layout';
import { CommentOutlined, DeleteOutlined } from '@ant-design/icons';
import { generateChatInfo } from '@/utils';
import { chatAsync } from '@/store/async';
import ChatMessage from './components/ChatMessage';
import Reminder from '@/components/Reminder';
import useMobile from '@/hooks/useMobile';
import AllInput from './components/AllInput';
import { ChatGpt } from '@/types';
import { configStore } from '@/store';
import { generateUUID } from '@utils/generateUUID';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import EditDialogue from './components/EditDialogue';
import DeleteDialogue from './components/DeleteDialogue';

export default function ChatPage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const info = generateChatInfo();
    const [chats, setChats] = useState([info]);
    const [selectChatId, setSelectChatId] = useState(info.id);
    const [fetchController, setFetchController] = useState(null);
    const { config, models, changeConfig, setConfigModal } = configStore();
    const [scrollTop, setScrollTop] = useState(0);

    // 创建对话按钮
    const CreateChat = () => {
        return (
            <Button
                block
                type="dashed"
                style={{
                    marginBottom: 6,
                    marginLeft: 0,
                    marginRight: 0
                }}
                onClick={() => {
                    const arr = cloneDeep(chats);
                    const uuid = generateUUID();
                    arr.unshift({
                        id: `new-dialogue-${uuid}`,
                        name: '新建对话',
                        path: `new-dialogue-${uuid}`,
                        data: []
                    });

                    setChats(arr);
                    setSelectChatId(`new-dialogue-${uuid}`);
                }}
            >
                新建对话
            </Button>
        );
    };

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
                setSelectChatId(arr[0]?.id);
            }

            setChats(arr);
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
        const chatArr = cloneDeep(chats).map((item) => {
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

        setChats(chatArr);

        const dialogue = chatArr.filter((item) => item.id === selectChatId)[0];
        const params = {
            message: { role: 'user', content: value },
            model: config.model
        };

        if (type === 'new') {
            params['chatName'] = dialogue?.name || '';
        } else {
            params['chatId'] = dialogue?.id;
        }

        let resp: any = {};
        resp = await chatAsync.sendChatMessages(params);

        if (resp) {
            //  如果是新对话
            const arr = chatArr.map((item, index) => {
                let timestamp = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');

                if (item.id === selectChatId) {
                    if (type === 'new') {
                        item.id = resp.chatId;
                        item.path = resp.chatId;
                    }

                    item.data = cloneDeep(item.data).map((dialogueRecord) => {
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
            setChats(arr);
        }
    }

    // 对话
    async function sendChatCompletions(value: string, refurbishOptions?: ChatGpt) {
        const dialogue = chats.filter((c) => c.id === selectChatId)[0];

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
        const chatList = chats.filter((c) => c.id === selectChatId);

        return chatList.length <= 0 ? [] : chatList[0].data;
    }, [selectChatId, chats]);

    useEffect(() => {
        getChatMessage();
    }, []);

    useEffect(() => {
        const topValue = scrollRef?.current?.clientHeight || 0;
        setScrollTop(topValue);
    }, [scrollRef?.current?.clientHeight]);

    if (scrollRef?.current) {
        console.log('111111111111', scrollTop);
        scrollRef.current.scrollTop = scrollTop;
        console.log('scrollRef.current.scrollTop', scrollRef.current.scrollTop);
    }

    return (
        <div className={styles.chatPage}>
            <Layout
                menuExtraRender={() => <CreateChat />}
                route={{ path: '/', routes: chats }}
                menuFooterRender={(props) => {
                    return (
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Select
                                size="middle"
                                style={{ width: '100%' }}
                                defaultValue={config.model}
                                value={config.model}
                                options={models.map((m) => ({ ...m, label: 'AI模型: ' + m.label }))}
                                onChange={(e) => {
                                    changeConfig({
                                        ...config,
                                        model: e.toString()
                                    });
                                }}
                            />
                        </Space>
                    );
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
                                        refresh: () => getChatMessage()
                                    }}
                                />
                            </div>
                        </div>
                    );
                }}
            >
                <div className={styles.chatPage_container}>
                    <div className={styles.chatPage_container_one}>
                        <div id="image-wrapper" ref={scrollRef}>
                            {chatMessages.map((item) => {
                                return (
                                    <ChatMessage
                                        key={item.dateTime + item.role + item.text}
                                        position={item.role === 'user' ? 'right' : 'left'}
                                        status={item.status}
                                        content={item.text}
                                        time={item.dateTime}
                                        model={item.requestOptions.options?.model}
                                        onDelChatMessage={() => {
                                            // delChatMessage(selectChatId, item.id);
                                        }}
                                        onRefurbishChatMessage={() => {
                                            // sendChatCompletions(item.requestOptions.prompt, item);
                                        }}
                                    />
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
                            clearMessage={() => {
                                // chatAsync.fetchDelUserMessages({ id: selectChatId, type: 'clear' });
                            }}
                            onStopFetch={() => {
                                // 结束
                                // setFetchController((c) => {
                                //     c?.abort();
                                //     return null;
                                // });
                            }}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
}
