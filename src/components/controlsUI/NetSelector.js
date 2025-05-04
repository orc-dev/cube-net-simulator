import { useState } from 'react';
import { useAnimation } from '../../contexts/AnimationContext.js';
import CubeNet from '../../cubenets/CubeNet.js';
import { Select, Typography } from 'antd';

const { Title } = Typography;


function NetSelector() {
    const { signal, sliderRef, progressRef, buildConfig } = useAnimation();
    const [selectedNetId, setSelectedNetId] = useState(4);

    return (<div>
        <Title level={5}>Select a Net</Title>
        <Select
            style={{ width: '100%', marginBottom: 20 }}
            placeholder='Choose a primitive net'
            value={selectedNetId}
            onChange={(value) => {
                // set id to update UI
                setSelectedNetId(value);

                // reset animation-slider
                sliderRef.current.value = 0;
                progressRef.current = 0;

                // update build config and inc signal
                buildConfig.current.net = value;
                signal.current++;
            }}
        >
            {CubeNet.VALID_NETS.map((net) => (
                <Select.Option key={net.netId} value={net.netId}>
                    {net.netName}
                </Select.Option>
            ))}
        </Select>
    </div>);
}

export default NetSelector;