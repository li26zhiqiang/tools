import { Alert, Input, Image, Slider, message, Select } from 'antd';
import { useLayoutEffect, useRef, useState } from 'react';
import { drawStore } from '@/store';
import OpenAiLogo from '@/components/OpenAiLogo';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { formatTime, generateUUID } from '@/utils';
import { ResponseData } from '@/request';
import styles from './index.module.less';
import sun from '@/assets/images/sun.svg';
import CreatePic from './CreatePic.jsx';
import EditPic from './EditPic.jsx';
import Marquee from 'react-fast-marquee';
import UploadPage from './UploadPage.jsx';

const drawSize = [
    {
        label: '512px',
        value: 512
    },
    {
        label: '1024px',
        value: 1024
    }
];

function DrawPage() {
    const { historyDrawImages, clearhistoryDrawImages, addDrawImage } = drawStore();

    const containerOneRef = useRef<HTMLDivElement>(null);
    const containerTwoRef = useRef<HTMLDivElement>(null);
    const [bottom, setBottom] = useState(0);

    const [collapse, setCollapse] = useState(false);

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

    const [drawType, setDrawType] = useState('openai');
    const [drawResultData, setDrawResultData] = useState<{
        loading: boolean;
        list: Array<{ url: string }>;
    }>({
        loading: false,
        list: []
    });
    const [fileList, setFileList] = useState([]);
    const [renderVal, setRenderVal] = useState(null);

    const handleDraw = (res: ResponseData<Array<{ url: string }>>) => {
        if (res.code || res.data.length <= 0) {
            message.error('请求错误 🙅');
            return;
        }
        setDrawResultData({
            loading: false,
            list: res.data
        });
        const addImagesData = res.data.map((item) => {
            return {
                ...item,
                ...drawConfig,
                draw_type: drawType,
                id: generateUUID(),
                dateTime: formatTime()
            };
        });
        addDrawImage(addImagesData);
    };

    const handleScroll = () => {
        const twoClientHeight = containerTwoRef.current?.clientHeight || 0;
        const oneScrollTop = containerOneRef.current?.scrollTop || 0;
        if (oneScrollTop > 100) {
            setBottom(-(twoClientHeight + 100));
        } else {
            setBottom(0);
        }
    };

    useLayoutEffect(() => {
        containerOneRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            containerOneRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.drawPage}>
            <Alert
                banner
                message={
                    <Marquee pauseOnHover gradient={false}>
                        目前上传和生成图片仅支持PNG格式，上传图片仅支持4M以下。
                    </Marquee>
                }
            />
            <div className={styles.drawPage_container}>
                <div className={styles.drawPage_container_one} ref={containerOneRef}>
                    <div className={styles.drawPage_header}>
                        <img src={sun} alt="Midjourney" />
                        <h2>AI 一下，妙笔生画</h2>
                        <h4>只需一句话，让你的文字变成画作</h4>
                    </div>
                    <div
                        className={styles.drawPage_create}
                        style={{
                            minHeight: drawResultData.loading || drawResultData.list.length > 0 ? '' : 0
                        }}
                    >
                        {drawResultData.loading && <OpenAiLogo rotate width="3em" height="3em" />}
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
                    <div className={styles.drawPage_mydraw}>
                        <Image.PreviewGroup>
                            <div className={styles.drawPage_mydraw_list}>
                                {historyDrawImages.map((item) => {
                                    return (
                                        <div key={item.id} className={styles.drawPage_mydraw_list_item}>
                                            <Image className={styles.drawPage_image} src={item.url} />
                                            <p>{item.prompt}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </Image.PreviewGroup>
                    </div>
                    <div className={styles.drawPage_container_upload}>
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
                    </div>
                </div>
                <div
                    className={styles.drawPage_container_two}
                    style={{
                        bottom: bottom
                    }}
                    ref={containerTwoRef}
                >
                    <div className={styles.drawPage_config}>
                        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                            <div className={styles.drawPage_config_collapse} onClick={() => setCollapse((c) => !c)}>
                                {collapse ? (
                                    <p>
                                        <CaretUpOutlined />
                                        <span style={{ fontSize: 12 }}>展开配置</span>
                                    </p>
                                ) : (
                                    <p>
                                        <CaretDownOutlined />
                                        <span style={{ fontSize: 12 }}>收缩配置</span>
                                    </p>
                                )}
                            </div>
                            <div
                                className={styles.drawPage_config_options}
                                style={{
                                    maxHeight: collapse ? 0 : '300px'
                                }}
                            >
                                <div className={styles.drawPage_config_group}>
                                    <div className={styles.drawPage_config_item}>
                                        <p>图片像素大小：</p>
                                        <Select
                                            defaultValue={drawConfig.width}
                                            value={drawConfig.width}
                                            options={drawSize}
                                            onChange={(e) => {
                                                setDrawConfig((c) => ({ ...c, width: e }));
                                            }}
                                        />
                                    </div>
                                    <div className={styles.drawPage_config_item}>
                                        <p>生成数量({drawConfig.quantity}张)：</p>
                                        <Slider
                                            defaultValue={drawConfig.quantity}
                                            value={drawConfig.quantity}
                                            min={1}
                                            max={3}
                                            onChange={(e) => setDrawConfig((c) => ({ ...c, quantity: e }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.drawPage_config_input}>
                            <Input.TextArea
                                maxLength={100}
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                defaultValue={drawConfig.prompt}
                                value={drawConfig.prompt}
                                onChange={(e) => setDrawConfig((config) => ({ ...config, prompt: e.target.value }))}
                                style={{ borderRadius: 0 }}
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
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DrawPage;
