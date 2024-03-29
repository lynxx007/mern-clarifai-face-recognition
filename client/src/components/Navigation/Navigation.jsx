import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const Navigation = () => {
    const { isLogin, logoutUser } = useContext(AppContext)
    const { toast } = useToast()
    if (isLogin) {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link onClick={() => {
                    logoutUser()
                    toast({
                        description: "Logged Out successfully."
                    })

                }} to='/login' className='f3 link dim black underline pa3 pointer'>Sign Out</Link>
            </nav >
        );
    } else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to='/login' className='f3 link dim black underline pa3 pointer'>Sign In</Link>
                <Link to='/register' className='f3 link dim black underline pa3 pointer'>Register</Link>
            </nav>
        );
    }
}

export default Navigation;