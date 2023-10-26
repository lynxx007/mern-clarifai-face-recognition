import { AppContext } from '@/context/AppContext';
import './Camera-style.css'
import { useState, useEffect, useRef, useContext } from 'react';

export const Camera = () => {
    const [webcamStream, setWebcamStream] = useState(null);
    const [capturedImageData, setCapturedImageData] = useState(null);
    const { submitImgRegister, box } = useContext(AppContext)
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


    // Function to capture the image from the webcam
    const captureImage = () => {
        if (webcamStream) {
            const videoElement = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (!blob) return null;

                if (capturedImageData) URL.revokeObjectURL(capturedImageData);

                // Generate a dynamic filename based on the current date and time
                const timestamp = Date.now();
                const fileName = `image-${timestamp}.jpeg`

                // Create a File object from the Blob
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                setCapturedImageData(file);

                submitImgRegister(file);
            });

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
                    <img id='inputimage' src={URL.createObjectURL(capturedImageData)} alt="Captured" />
                    {box ? (
                        box.map((item) => (
                            <div
                                key={item.bottomRow}
                                className='bounding-box'
                                style={{
                                    top: item.topRow,
                                    right: item.rightCol,
                                    bottom: item.bottomRow,
                                    left: item.leftCol,
                                }}
                            ></div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
            )}
        </div>
    );
};
