import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { Navigate } from 'react-router-dom'




export const ProtectedRoute = ({ children }) => {
    const { isLogin } = useContext(AppContext)

    if (!isLogin) {
        return (
            <Navigate to='/login' />
        )
    }
    return children
}