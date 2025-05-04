import { useState } from 'react';
import { useAnimation } from '../../contexts/AnimationContext';
import { Radio, Typography } from 'antd';


const { Title } = Typography;

function ModeSelector() {
    const { signal, sliderRef, progressRef, buildConfig } = useAnimation();
    const [animationMode, setAnimationMode] = useState('rootFirst');

    return (<div>
        <Title level={5}>Animation Mode</Title>
        <Radio.Group 
            value={animationMode}
            onChange={(e) => {
                setAnimationMode(e.target.value);

                // reset animation-slider
                progressRef.current = 0;
                sliderRef.current.value = 0;

                // update build config and inc signal
                buildConfig.current.animationMode = e.target.value;
                signal.current++;    
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}
        >
            <Radio value='rootFirst'>Root-first mode</Radio>
            <Radio value='leaveFirst'>Leave-first mode</Radio>
            <Radio value='compact'>Compact mode</Radio>
        </Radio.Group>
    </div>);
}

export default ModeSelector;