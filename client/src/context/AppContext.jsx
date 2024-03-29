import { createContext, useEffect, useReducer } from "react";
import { createAction } from "../utils/actionCreator";
import axios from 'axios'
import { calculateFaceLocation } from "../utils/calculateFaceLocation";
import { APP_ACTION_TYPE } from "./ActionType";


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
    isLogin: false,
    isHuman: false,
    url: ''
}


export const AppContext = createContext()

const appReducer = (state = initialState, action) => {
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
        case APP_ACTION_TYPE.SUBMIT_IMG_FAIL:
            return {
                ...state,
                isLoading: false,
                alertText: 'Theres an error with the server, you could try again or could change another image.',
                showAlert: true
            }
        case APP_ACTION_TYPE.SUBMIT_IMG_START_REGIS:
            return {
                ...state,
                isLoading: true,
                isHuman: false
            }

        case APP_ACTION_TYPE.SUBMIT_IMG_REGIS:
            return {
                ...state,
                isLoading: false,
                box: action.payload.calculatedFaceLocation,
                isHuman: action.payload.isHuman,
                url: action.payload.url
            }
        case APP_ACTION_TYPE.SUBMIT_IMG_FAIL_REGIS:
            return {
                ...state,
                isLoading: false,
                alertText: 'Theres an error with the server, you could try again or could change another image.',
                showAlert: true
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

        try {
            const response = await axios.get('api/v1/image/predict', {
                params: { imageUrl: imageUrl },
            })
            const { entries } = response.data
            const calculatedFaceLocation = calculateFaceLocation(response)

            dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG, { entries, calculatedFaceLocation }))
        } catch (error) {
            dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG_FAIL))
            setTimeout(hideAlert, 3000)
        }


    }

    const submitImgRegister = async (dataImage) => {
        dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG_START_REGIS))
        const fileName = dataImage.name

        const regex = /image-(\d+)\.jpeg/;
        const match = fileName.match(regex); // Use match() to find the pattern in the fileName

        if (match) {
            // Extract the captured number using match[1] and convert it to an integer
            const timestamp = parseInt(match[1]);
            console.log(timestamp);
            try {
                const formData = new FormData();
                formData.set('image', dataImage);

                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                const response = await axios.post(`api/v1/auth/faceDetect/${timestamp}`, formData, config);
                console.log(response);
                const { url, isHuman } = response.data
                const calculatedFaceLocation = calculateFaceLocation(response);
                dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG_REGIS, { calculatedFaceLocation, url, isHuman }));
            } catch (error) {
                console.log(error);
                dispatch(createAction(APP_ACTION_TYPE.SUBMIT_IMG_FAIL_REGIS));
                setTimeout(hideAlert, 3000);
            }
        } else {
            console.log("Filename doesn't match the expected pattern.");
            // Handle the case where the fileName doesn't match the pattern.
            // You can dispatch an appropriate action or show an error message.
        }
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
        submitImg,
        submitImgRegister
    }

    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}