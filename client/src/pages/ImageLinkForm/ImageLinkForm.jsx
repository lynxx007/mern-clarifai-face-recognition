import './ImageLinkForm.css';
import Logo from '../../components/Logo/Logo'
import Rank from '../../components/Rank/Rank'
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition'
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
const ImageLinkForm = () => {
    const [input, setInput] = useState('')
    const { submitImg, box, entries, name } = useContext(AppContext)

    const handleInputChange = e => {
        setInput(e.target.value)
    }

    const onButtonSubmit = (e) => {
        e.preventDefault()
        submitImg(input)


    }
    return (

        <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Git it a try.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' placeholder='URL image that contains a face' type='text' onChange={handleInputChange} />
                    <button
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
            <FaceRecognition imageUrl={input} box={box} />
        </div >
    );
}

export default ImageLinkForm;