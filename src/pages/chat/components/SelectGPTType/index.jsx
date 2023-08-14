import React, { useEffect, useState } from 'react';
import { Space, Select } from 'antd';
import { configStore } from '@/store';
import { chatAsync } from '@/store/async';

export default function SelectGPTType(props) {
    const { config, models, changeConfig, setConfigModal } = configStore();
    const { gptType, setGptType } = props;

    async function getUserGPTType() {
        const resp = await chatAsync.getUserQuota();

        if (resp) {
            setGptType(resp);
        }
    }

    useEffect(() => {
        getUserGPTType();
    }, []);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Select
                size="middle"
                style={{ width: '100%' }}
                defaultValue={gptType || config.model}
                value={gptType || config.model}
                options={models.map((m) => ({ ...m, label: 'AI模型: ' + m.label }))}
                onChange={(e) => {
                    setGptType(e.toString());
                }}
            />
        </Space>
    );
}
