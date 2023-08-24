import { useRef, useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {


  const cameraPreviewEl = useRef(null);

  const beginCapture = useCallback(
    async () => {
      if (!cameraPreviewEl.current) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraPreviewEl.current.srcObject = stream;
      cameraPreviewEl.current.play();
    },
    [cameraPreviewEl]
  );

  return (
    <>
      <main className='main'>
        <div className='description'>
          <h1>Which Celebrity Do you look like?</h1>
          <a onClick={beginCapture} >Click to take a photo of yourself!</a>
        </div>
        <video className='video' ref={cameraPreviewEl} />
      </main>
    </>
  )
}

export default App
