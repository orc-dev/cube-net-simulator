import { useAnimation } from './contexts/AnimationContext.js';
import R3FCanvas from './components/R3FCanvas.js';
import { NetSelector, BaseSelector, ModeSelector, PlayerSlider } from './components/controlsUI';
import { Layout, Divider, Button, Typography } from 'antd';
import { PiVideoCameraFill } from 'react-icons/pi';

const { Sider } = Layout;

function AppTitle() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '6px' 
        }}>
            <img 
                src={`${process.env.PUBLIC_URL}/cube_icon.png`} 
                alt='app-icon' 
                style={{ width: 32, height: 32 }} 
            />
            <Typography.Title
                level={3}
                style={{
                    color: 'black',
                    fontFamily: "'Quantico', sans-serif",
                    margin: 0
                }}
            >
                Cube-Net Simulator
            </Typography.Title>
        </div>
    );
}

function ResetCameraButton() {
    const { camCtrlRef } = useAnimation();
    return (
        <Button 
            type='primary'
            onClick={() => camCtrlRef.current?.resetWithAnimation?.()}
            block
            icon={<PiVideoCameraFill />}
        >
            Reset Camera
        </Button>
    );
}

function App() {
    console.log('App is re-rendering...');

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={320} style={{ background: '#fff', padding: '20px' }}>
                <AppTitle />
                <Divider /> 
                <NetSelector />
                <BaseSelector />
                <ModeSelector />
                <Divider />
                <PlayerSlider />
                <Divider />
                <ResetCameraButton />
            </Sider>
            <R3FCanvas />
        </Layout>
    );
}

export default App;
