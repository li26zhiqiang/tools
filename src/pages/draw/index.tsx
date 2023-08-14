import React from 'react';
import { Tabs, Alert, Card } from 'antd';
import type { TabsProps } from 'antd';
import TextGeneratedPicture from './TextGeneratedPicture';
import PictureGeneratedPicture from './PictureGeneratedPicture';
import Layout from '@/components/Layout';
import styles from './index.module.less';
import Marquee from 'react-fast-marquee';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '文生图',
        children: <TextGeneratedPicture />
    },
    {
        key: '2',
        label: '图生图',
        children: <PictureGeneratedPicture />
    }
];

const DrawPic: React.FC = () => (
    <>
        <Alert
            banner
            message={
                <Marquee pauseOnHover gradient={false}>
                    目前上传和生成图片仅支持PNG格式，上传图片仅支持4M以下。
                </Marquee>
            }
        />
        <Card className={styles.pageView}>
            <div className={styles.pageViewPosition}>
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </Card>
    </>
);

export default DrawPic;
