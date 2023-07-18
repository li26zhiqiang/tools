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
import { ChatGpt, RequestChatOptions } from '@/types';
import { chatStore, configStore, userStore } from '@/store';

export default function ChatPage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const info = generateChatInfo();
    const [chats, setChats] = useState([info]);
    const [selectChatId, setSelectChatId] = useState(info.id);
    const [fetchController, setFetchController] = useState(null);
    const { config, models, changeConfig, setConfigModal } = configStore();

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
                    // addChat();
                }}
            >
                新建对话
            </Button>
        );
    };

    async function getChatMessage() {
        const resp = await chatAsync.fetchChatMessages();

        if (resp && resp.length !== 0) {
            setChats(resp);
        }
    }

    async function getDialogue(vaule: string, type: string) {
        const dialogue = chats.filter((c) => c.id === selectChatId)[0];

        const params = {
            message: { role: 'user', content: vaule },
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
            if (type === 'new') {
                const arr = chats.map((item, index) => {
                    if (item.id === selectChatId) {
                        item.id = resp.chatId;
                        // item.path = resp.chatId;
                        // item.data = [
                        //     {
                        //         dateTime: '',
                        //         id:
                        //     }
                        // ];
                    }
                    return item;
                });
                setSelectChatId(resp.chatId);
                console.log('arr', arr);
                setChats(arr);
            }
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

        //  老对话聊天

        // const resp = await chatAsync.sendChatMessages();
        //     let userMessageId = generateUUID();
        //     const requestOptions = {
        //         prompt: vaule,
        //         parentMessageId,
        //         options: filterObjectNull({
        //             ...config,
        //             ...refurbishOptions?.requestOptions.options
        //         })
        //     };
        //     const assistantMessageId = refurbishOptions?.id || generateUUID();
        //     if (refurbishOptions?.requestOptions.parentMessageId && refurbishOptions?.id) {
        //         userMessageId = '';
        //         setChatDataInfo(selectChatId, assistantMessageId, {
        //             status: 'loading',
        //             role: 'assistant',
        //             text: '',
        //             dateTime: formatTime(),
        //             requestOptions
        //         });
        //     } else {
        //         setChatInfo(selectChatId, {
        //             id: userMessageId,
        //             text: vaule,
        //             dateTime: formatTime(),
        //             status: 'pass',
        //             role: 'user',
        //             requestOptions
        //         });
        //         setChatInfo(selectChatId, {
        //             id: assistantMessageId,
        //             text: '',
        //             dateTime: formatTime(),
        //             status: 'loading',
        //             role: 'assistant',
        //             requestOptions
        //         });
        //     }
        //     // 取消fetch请求
        //     const controller = new AbortController();
        //     const signal = controller.signal;
        //     setFetchController(controller);
        //     serverChatCompletions({
        //         requestOptions,
        //         signal,
        //         userMessageId,
        //         assistantMessageId
        //     });
    }

    // 当前聊天记录
    const chatMessages = useMemo(() => {
        const chatList = chats.filter((c) => c.id === selectChatId);

        return chatList.length <= 0 ? [] : chatList[0].data;
    }, [selectChatId, chats]);

    useEffect(() => {
        getChatMessage();
    }, []);

    console.log('chats', chats);
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
                                <Popconfirm
                                    title="删除会话"
                                    description="是否确定删除会话？"
                                    onConfirm={(e) => {
                                        e?.preventDefault();
                                        e?.stopPropagation();
                                        // chatAsync.fetchDelUserMessages({ id: item.id, type: 'del' });
                                    }}
                                    onCancel={(e) => {
                                        e?.preventDefault();
                                        e?.stopPropagation();
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    />
                                </Popconfirm>
                            </div>
                        </div>
                    );
                }}
            >
                <div className={styles.chatPage_container}>
                    <div ref={scrollRef} className={styles.chatPage_container_one}>
                        <div id="image-wrapper">
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
                                // scrollToBottomIfAtBottom();
                            }}
                            clearMessage={() => {
                                chatAsync.fetchDelUserMessages({ id: selectChatId, type: 'clear' });
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
