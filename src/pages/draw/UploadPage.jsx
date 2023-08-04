import React, { useState } from 'react';
import { Upload, message, Form } from 'antd';
import { CloseCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './index.module.less';

export default function UploadPage(props) {
    const [form] = Form.useForm();
    const { setDrawConfig, drawConfig, fileList, setFileList, setReaderVal } = props;
    const [showImage, setShowImage] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const beforeUpload = async (file) => {
        const isPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt4M = file.size / 1024 / 1024 < 4;

        if (!isPng) {
            message.error('仅支持png格式图片');
        }

        if (!isLt4M) {
            message.error('图片大小仅支持4M以下');
        }
        return isPng && isLt4M;
    };

    function getBase64(img, callback) {
        const reader = new FileReader();

        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
        setReaderVal(reader.result);
    }

    const handleChange = (info) => {
        const fileType = info.file.name.split('.').pop();

        if (fileType === 'png') {
            setFileList(info.fileList.slice(-1));
            info.file.status = 'done';
            getBase64(info.file.originFileObj, (url) => setImageUrl(url));
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <Form form={form}>
            <Form.Item name="sourceFile" rules={[{ required: true }]}>
                <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    fileList={fileList}
                    maxCount={1}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            style={{
                                width: '100%'
                            }}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </Form.Item>
        </Form>
    );
}
