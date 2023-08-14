import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Input, Image, Button, Card } from 'antd';
import OpenAiLogo from '@/components/OpenAiLogo';
import { chatAsync } from '@/store/async';
import styles from './index.module.less';
import sun from '@/assets/images/sun.svg';
import CreatePic from './CreatePic.jsx';
import MyHistory from './MyHistory';
import PictureQuality from './PictureQuality';

export default function TextGeneratedPicture() {
    const containerOneRef = useRef<HTMLDivElement>(null);
    const containerTwoRef = useRef<HTMLDivElement>(null);
    const [listData, setListData] = useState<any>([]);
    const [drawResultData, setDrawResultData] = useState<{
        loading: boolean;
        list: Array<{ url: string }>;
    }>({
        loading: false,
        list: []
    });

    const [drawConfig, setDrawConfig] = useState<{
        prompt: string;
        quantity: number;
        width: number;
        height: number;
        quality?: number;
        steps?: number;
        style?: string;
        image?: File | string;
    }>({
        prompt: '',
        quantity: 1,
        width: 1024,
        height: 1024,
        quality: 7,
        steps: 50,
        style: '',
        image: ''
    });

    async function getHistoryPic() {
        const resp = await chatAsync.getUserHistoryPic();

        if (resp) {
            setListData(resp);
        }
    }

    useEffect(() => {
        getHistoryPic();
    }, []);

    return (
        <Row>
            <Col span={16}>
                <Card className={styles.drawPage_edit_pic}>
                    <div className={styles.drawPage}>
                        <div className={styles.drawPage_container}>
                            <div className={styles.drawPage_container_one} ref={containerOneRef}>
                                <div className={styles.drawPage_header}>
                                    <img src={sun} alt="Midjourney" />
                                    <h2>AI 一下，妙笔生画</h2>
                                    <h4>只需一句话，让你的文字变成画作</h4>
                                </div>
                            </div>

                            <div className={styles.drawPage_create}>
                                {drawResultData.loading && (
                                    <div className={styles.drawPage_create_logo}>
                                        <OpenAiLogo rotate width="3em" height="3em" />
                                    </div>
                                )}
                                <Image.PreviewGroup>
                                    {drawResultData.list.map((item) => {
                                        return (
                                            <Image
                                                className={styles.drawPage_image}
                                                key={item.url}
                                                width={160}
                                                src={item.url}
                                            />
                                        );
                                    })}
                                </Image.PreviewGroup>
                            </div>
                        </div>
                        <div className={styles.drawPage_two} ref={containerTwoRef}>
                            <div className={styles.drawPage_input}>
                                {/* <SetConfig {...{ setDrawResultData, drawResultData }} /> */}
                                <Input.TextArea
                                    maxLength={10000}
                                    autoSize={{ minRows: 1, maxRows: 1 }}
                                    defaultValue={drawConfig.prompt}
                                    value={drawConfig.prompt}
                                    onChange={(e) => setDrawConfig((config) => ({ ...config, prompt: e.target.value }))}
                                    style={{ borderRadius: '8px 0px 0px 8px' }}
                                    placeholder="请输入绘画提示次，可勾选优化文案功能对提示词进行优化效果会更好哦！"
                                />
                                <p>
                                    <CreatePic
                                        {...{
                                            drawResultData,
                                            drawConfig,
                                            setDrawResultData
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <PictureQuality {...{ drawConfig, setDrawConfig }} />
                <MyHistory {...{ listData }} />
            </Col>
        </Row>
    );
}
