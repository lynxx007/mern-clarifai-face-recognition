import ParticlesBg from 'particles-bg';
import Navigation from '../../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom';
import '../../App.css'
export const Layout = () => {
    return (
        <div className="App">
            <ParticlesBg type="fountain" bg={true} />
            <Navigation />
            <Outlet />
        </div>
    )
}
