import React from 'react';
import { Slider, Card, Form, Select } from 'antd';
const { Option } = Select;

export default function PictureQuality(props) {
    const { drawConfig, setDrawConfig } = props;

    function changeSize(val) {
        setDrawConfig({
            ...drawConfig,
            width: val.split('*')[0],
            height: val.split('*')[1]
        });
    }

    return (
        <>
            <Card size="small" bordered={false}>
                <Form>
                    <Form.Item name="size" label="图片大小" rules={[{ required: true }]}>
                        <Select placeholder="请选择" defaultValue={'1024*1024'} onChange={changeSize}>
                            <Option value="1024*1024">1024 * 1024</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="imageNums" label="生成数量" rules={[{ required: true }]}>
                        {
                            <Slider
                                defaultValue={drawConfig.quantity}
                                value={drawConfig.quantity}
                                min={1}
                                max={4}
                                onChange={(e) => setDrawConfig((c) => ({ ...c, quantity: e }))}
                            />
                        }
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
