import { useState } from 'react';
import { useAnimation } from '../../contexts/AnimationContext';
import { Radio, Typography } from 'antd';

const { Title } = Typography;


function BaseSelector() {
    const { signal, sliderRef, progressRef, buildConfig } = useAnimation();
    const [selectedBaseId, setSelectedBaseId] = useState(2);

    return (<div>
        <Title level={5}>Select a Base</Title>
        <div style={{ marginBottom: 20 }}>
            {/* A row of 6 radio circles */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Radio
                        key={num}
                        value={num}
                        checked={selectedBaseId === (num - 1)}
                        onChange={() => {
                            setSelectedBaseId(num - 1);

                            // reset animation-slider
                            sliderRef.current.value = 0;
                            progressRef.current = 0;

                            // update build config and inc signal
                            buildConfig.current.base = num - 1;
                            signal.current++;                
                        }}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                ))}
            </div>
            {/* A row of 6 text-labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} style={{ textAlign: 'center', width: '100%' }}>
                        <span style={{ fontSize: 12 }}>{num}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>);
}

export default BaseSelector;
