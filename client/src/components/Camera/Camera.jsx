import './Camera-style.css'
import { useState, useEffect, useRef } from 'react';

export const Camera = () => {
    const [webcamStream, setWebcamStream] = useState(null);
    const [capturedImageData, setCapturedImageData] = useState(null);
    const videoRef = useRef(null);

    console.log(capturedImageData);

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

    // Function to capture the image from the webcam
    const captureImage = () => {
        if (webcamStream) {
            const videoElement = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const capturedImageData = canvas.toDataURL('image/jpeg');

            setCapturedImageData(capturedImageData);
            stopWebcam();
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
                    <button onClick={captureImage}>Capture Image</button>
                </div>
            ) : (
                <button onClick={startWebcam}>Start Webcam</button>
            )}
            {capturedImageData && (
                <div>
                    <h2>Captured Image:</h2>
                    <img src={capturedImageData} alt="Captured" />
                </div>
            )}
        </div>
    );
};
