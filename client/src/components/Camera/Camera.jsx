import './Camera-style.css'
import { useState, useEffect, useRef } from 'react';

export const Camera = () => {
    const [webcamStream, setWebcamStream] = useState(null);
    const videoRef = useRef(null);

    // Function to start the webcam
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setWebcamStream(stream);
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    // Function to stop the webcam
    const stopWebcam = () => {
        if (webcamStream) {
            webcamStream.getTracks().forEach((track) => {
                track.stop();
            });
            setWebcamStream(null);
        }
    };

    useEffect(() => {
        // Clean up the webcam stream when the component unmounts
        return () => {
            stopWebcam();
        };
    }, []);

    useEffect(() => {
        // Set the srcObject when webcamStream changes
        if (webcamStream && videoRef.current) {
            videoRef.current.srcObject = webcamStream;
        }
    }, [webcamStream]);

    return (
        <div>
            {webcamStream ? (
                <div>
                    <video autoPlay playsInline muted ref={videoRef} />
                    <button onClick={stopWebcam}>Stop Webcam</button>
                </div>
            ) : (
                <button onClick={startWebcam}>Start Webcam</button>
            )}
        </div>
    );
};
