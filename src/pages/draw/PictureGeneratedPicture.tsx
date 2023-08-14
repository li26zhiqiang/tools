import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Image } from 'antd';
import EditPic from './EditPic.jsx';
import UploadPage from './UploadPage.jsx';
import OpenAiLogo from '@/components/OpenAiLogo';
import MyHistory from './MyHistory';
import styles from './index.module.less';
import { chatAsync } from '@/store/async';
import PictureQuality from './PictureQuality';

export default function PictureGeneratedPicture() {
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
        width: 512,
        height: 512,
        quality: 7,
        steps: 50,
        style: '',
        image: ''
    });
    const [drawResultData, setDrawResultData] = useState<{
        loading: boolean;
        list: Array<{ url: string }>;
    }>({
        loading: false,
        list: []
    });
    const [fileList, setFileList] = useState([]);
    const [renderVal, setRenderVal] = useState(null);
    const [listData, setListData] = useState([]);

    async function getHistoryPic() {
        let resp: any;
        resp = await chatAsync.getUserHistoryPic();

        if (resp) {
            setListData(resp);
        }
    }

    useEffect(() => {
        getHistoryPic();
    }, []);

    return (
        <div>
            <Row>
                <Col span={16}>
                    <Card className={styles.drawPage_edit_pic}>
                        <div className={styles.drawPage_container_upload}>
                            {drawResultData.loading && (
                                <div className={styles.drawPage_create_logo}>
                                    <OpenAiLogo rotate width="3em" height="3em" />
                                </div>
                            )}
                            <Row>
                                <Col span={12}>
                                    <UploadPage
                                        {...{
                                            setDrawConfig,
                                            drawConfig,
                                            fileList,
                                            setFileList,
                                            setRenderVal,
                                            renderVal,
                                            setDrawResultData
                                        }}
                                    />
                                </Col>
                                <Col span={12}>
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
                                </Col>
                            </Row>
                        </div>

                        <div className={styles.drawPage_edit_textarea}>
                            <Input.TextArea
                                maxLength={100}
                                autoSize={{ minRows: 1, maxRows: 1 }}
                                defaultValue={drawConfig.prompt}
                                value={drawConfig.prompt}
                                onChange={(e) => setDrawConfig((config) => ({ ...config, prompt: e.target.value }))}
                                style={{ borderRadius: '8px 0px 0px 8px' }}
                                placeholder="请输入绘画提示次，可勾选优化文案功能对提示词进行优化效果会更好哦！"
                            />
                            <EditPic
                                {...{
                                    drawResultData,
                                    drawConfig,
                                    setDrawResultData,
                                    fileList,
                                    setFileList,
                                    renderVal
                                }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <PictureQuality {...{ drawConfig, setDrawConfig }} />
                    <MyHistory {...{ listData }} />
                </Col>
            </Row>
        </div>
    );
}
