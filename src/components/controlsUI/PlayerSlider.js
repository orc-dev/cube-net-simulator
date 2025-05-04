import { useState, useEffect } from 'react';
import { useAnimation } from '../../contexts/AnimationContext';
import { Checkbox, Typography } from 'antd';

const { Title } = Typography;

function PlayerSlider() {
    const { 
        isAutoPlaying, showFaceLabels, faceLablesTask, sliderRef, progressRef
    } = useAnimation();
    const [autoPlay, setAutoPlay] = useState(false);
    const [showLabel, setShowLabel] = useState(true);

    // Attach event listener to the raw JS slider
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleInput = (e) => {
            const value = Number(e.target.value);
            progressRef.current = value;
        };

        slider.addEventListener('input', handleInput);

        return () => {
            slider.removeEventListener('input', handleInput);
        };
    // eslint-disable-next-line
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Title level={5} style={{ marginBottom: '5px' }}>Player Controls</Title>
            {/** check box: show face labels */}
            <Checkbox
                checked={showLabel}
                onChange={(e) => {
                    setShowLabel(e.target.checked);
                    showFaceLabels.current = e.target.checked;
                    faceLablesTask.current = false;
                }}
                style={{ marginTop: '10px', marginBottom: '5px' }}
            >
                Show Face Labels
            </Checkbox>

            {/** check box: auto play */}
            <Checkbox
                checked={autoPlay}
                onChange={(e) => {
                    setAutoPlay(e.target.checked);
                    isAutoPlaying.current = e.target.checked;
                }}
                style={{ marginTop: '10px', marginBottom: '20px' }}
            >
                Auto Play
            </Checkbox>

            {/** raw JS slider: process control */}
            <input
                ref={sliderRef}
                type='range'
                min='0'
                max='100'
                defaultValue={0}
                step='1'
                disabled={autoPlay}
                style={{ width: '100%', marginBottom: '8px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Net</span>
                <span>Cube</span>
            </div>
        </div>
    );
}

export default PlayerSlider;
