import React from 'react';
import { Button, message, Row } from 'antd';
import { chatAsync } from '@/store/async';
import styles from './index.module.less';

export default function CreatePic(props) {
    const { drawResultData, drawConfig, setDrawResultData } = props;

    //
    const onStartDraw = async () => {
        try {
            if (!drawConfig.prompt) {
                message.warning('请输入提示词');
                return;
            }

            setDrawResultData({
                loading: true,
                list: []
            });

            const params = {
                prompt: drawConfig.prompt,
                imageNums: drawConfig.quantity,
                size: `${drawConfig.width}*${drawConfig.width}`
            };

            let resp = await chatAsync.getPicture(params);
            if (resp && resp.length !== 0) {
                setDrawResultData({
                    loading: false,
                    list: resp.map((item) => {
                        return {
                            url: item
                        };
                    })
                });
            }
        } catch (err) {
            console.log('err', err);
        } finally {
            //
        }
    };

    return (
        <Button
            className={styles.drawPage_container_buttons}
            loading={drawResultData.loading}
            type="primary"
            onClick={onStartDraw}
        >
            {'生成图像'}
        </Button>
    );
}
