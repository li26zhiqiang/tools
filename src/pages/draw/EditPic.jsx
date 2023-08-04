import React from 'react';
import { Button, message } from 'antd';
import styles from './index.module.less';

export default function EditPic(props) {
    const { drawResultData, fileList, setDrawResultData, drawConfig, renderVal } = props;

    async function editPicture() {
        let formData = new FormData();
        fileList.forEach((item) => {
            formData.append('sourceFile', item?.originFileObj);
        });

        // formData.append('prompt', drawConfig.prompt);
        formData.append('imageNums', drawConfig.quantity);
        formData.append('size', `${drawConfig.width}*${drawConfig.width}`);

        setDrawResultData({
            loading: true,
            list: []
        });

        fetch('/tytech-admin/open-ai/images/variations', {
            method: 'PUT',
            body: formData
        })
            .then(async (response) => {
                let data = await response.json();

                if (data && data.code === 200 && data.data.length > 0) {
                    setDrawResultData({
                        loading: false,
                        list: data.data.map((item) => {
                            return {
                                url: item
                            };
                        })
                    });
                }
            })
            .catch((error) => {
                message.error('编辑失败');
            });
    }

    return (
        <Button
            className={styles.drawPage_edit_config_input_buttons}
            loading={drawResultData.loading}
            onClick={editPicture}
        >
            {'编辑图像'}
        </Button>
    );
}
