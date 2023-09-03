import { createContext, useEffect, useReducer } from "react";
import { createAction } from "../utils/actionCreator";
import axios from 'axios'
import { calculateFaceLocation } from "../utils/calculateFaceLocation";


const initialState = {
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: '',
    isLoading: false,
    showAlert: false,
    alertText: '',
    box: [],
    isLogin: false
}

export const APP_ACTION_TYPE = {
    SET_ALERT: 'SHOW_ALERT',
    HIDE_ALERT: 'HIDE_ALERT',
    REGISTER_USER_START: 'REGISTER_USER_START',
    REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS',
    REGISTER_USER_FAIL: 'REGISTER_USER_FAIL',
    LOGIN_USER_START: 'LOGIN_USER_START',
    LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
    LOGIN_USER_FAIL: 'LOGIN_USER_FAIL',
    LOGOUT_USER: 'LOGOUT_USER',
    SUBMIT_IMG: 'SUBMIT_IMG',
    SUBMIT_IMG_START: 'SUBMIT_IMG_START',
    GET_CURRENT_USER_START: 'GET_CURRENT_USER_START',
    GET_CURRENT_USER_SUCCESS: 'GET_CURRENT_USER_SUCCESS',
}

export const AppContext = createContext()

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP_ACTION_TYPE.SET_ALERT:
            return {
                ...state,
                showAlert: true,
                alertText: 'Please Provide All Values'
            }
        case APP_ACTION_TYPE.HIDE_ALERT:
            return {
                ...state,
                showAlert: false,
                alertText: ''
            }
        case APP_ACTION_TYPE.REGISTER_USER_START:
            return {
                ...state,
                isLoading: true
            }
        case APP_ACTION_TYPE.REGISTER_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                id: action.payload.id,
                email: action.payload.email,
                name: action.payload.fullName,
                entries: action.payload.entries,
                joined: action.payload.createAt,
                isLogin: true,
                alertText: 'Register successfully!',
                showAlert: true,
            }
        case APP_ACTION_TYPE.REGISTER_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                showAlert: true,
                alertText: 'Something went wrong or might be the email has been associated from other account, Try it again.'
            }
        case APP_ACTION_TYPE.LOGIN_USER_START:
            return {
                ...state,
                isLoading: true
            }
        case APP_ACTION_TYPE.LOGIN_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                id: action.payload.id,
                email: action.payload.email,
                name: action.payload.fullName,
                entries: action.payload.entries,
                joined: action.payload.createAt,
                isLogin: true,
                showAlert: true,
                alertText: 'Login successfully!'
            }
        case APP_ACTION_TYPE.LOGIN_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                showAlert: true,
                alertText: 'Something went wrong, Try it again.'
            }
        case APP_ACTION_TYPE.LOGOUT_USER:
            return {
                ...state,
                id: '',
                email: '',
                name: '',
                entries: '',
                joined: '',
                isLogin: false,
                isLoading: false,
                showAlert: true,
                alertText: 'Logout successfully!'
            }
        case APP_ACTION_TYPE.SUBMIT_IMG:
            return {
                ...state,
                entries: action.payload.entries,
                box: action.payload.calculatedFaceLocation,
                isLoading: false
            }
        case APP_ACTION_TYPE.SUBMIT_IMG_START:
            return {
                ...state,
                isLoading: true,
            }
        case APP_ACTION_TYPE.GET_CURRENT_USER_START:
            return {
                ...state,
                isLoading: true,
            }
        case APP_ACTION_TYPE.GET_CURRENT_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                id: action.payload.id,
                email: action.payload.email,
                name: action.payload.fullName,
                entries: action.payload.entries,
                joined: action.payload.createAt,
                isLogin: true,
                showAlert: true,
                alertText: 'Login successfully!'
            }

        default:
            throw new Error(`unhandled type ${action.type}`)
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const displayAlert = () => {
        dispatch(createAction(APP_ACTION_TYPE.SET_ALERT))
    }

    const hideAlert = () => {
        dispatch(createAction(APP_ACTION_TYPE.HIDE_ALERT))
    }

    const registerUser = async (emailUser, fullNameUser, password) => {
        dispatch(createAction(APP_ACTION_TYPE.REGISTER_USER_START))

        try {
            const response = await axios.post('api/v1/auth/register', {
                email: emailUser,
                fullName: fullNameUser,
                password
            })
            const { id, fullName, email, entries, createAt } = response.data.user
            dispatch(createAction(APP_ACTION_TYPE.REGISTER_USER_SUCCESS, { id, fullName, entries, createAt, email }))
        } catch (error) {
            dispatch(createAction(APP_ACTION_TYPE.REGISTER_USER_FAIL))
            setTimeout(hideAlert, 3000)
        }
    }

    const loginUser = async (emailUser, passwordUser) => {
        dispatch(createAction(APP_ACTION_TYPE.LOGIN_USER_START))
        try {
            const response = await axios.post('api/v1/auth/login', {
                email: emailUser, password: passwordUser
            })
            const { id, email, entries, fullName, createAt } = response.data.user
            dispatch(createAction(APP_ACTION_TYPE.LOGIN_USER_SUCCESS, { id, email, entries, fullName, createAt }))
        } catch (error) {
            dispatch(createAction(APP_ACTION_TYPE.LOGIN_USER_FAIL))
        }
    }

    const logoutUser = async () => {
        await axios.get('api/v1/auth/logout')
        dispatch(createAction(APP_ACTION_TYPE.LOGOUT_USER))
        setTimeout(hideAlert, 3000)
    }

    const submitImg = async (imageUrl) => {
        dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG_START))
        const response = await axios.get('api/v1/image/predict', {
            params: { imageUrl: imageUrl },
        })
        const { entries } = response.data
        const calculatedFaceLocation = calculateFaceLocation(response)

        dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG, { entries, calculatedFaceLocation }))
    }

    const getCurrentUser = async () => {
        dispatch(createAction(APP_ACTION_TYPE.GET_CURRENT_USER_START))
        try {
            const response = await axios.get('api/v1/auth/getCurrentUser')
            const { id, email, entries, fullName, createAt } = response.data.user
            dispatch(createAction(APP_ACTION_TYPE.GET_CURRENT_USER_SUCCESS, { id, email, entries, fullName, createAt }))
        } catch (error) {
            if (error.response.status === 401) return
            logoutUser()
        }
    }
    useEffect(() => {
        getCurrentUser()
    }, [])



    const value = {
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        logoutUser,
        hideAlert,
        submitImg
    }

    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}