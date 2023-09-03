import './ImageLinkForm.css';
import Logo from '../../components/Logo/Logo'
import Rank from '../../components/Rank/Rank'
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition'
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ImageLinkForm = () => {
    const [input, setInput] = useState('')
    const { submitImg, box, entries, name, isLoading } = useContext(AppContext)
    const [showFaceComponent, setShowFaceComponent] = useState(false)

    const handleInputChange = e => {
        setInput(e.target.value)
        if (input.length === 0) {
            setShowFaceComponent(false)
        }
    }

    const onButtonSubmit = (e) => {
        e.preventDefault()
        submitImg(input)
        setShowFaceComponent(true)

    }

    return (

        <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Git it a try.'}
            </p>
            <div className='center mt-10'>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input onChange={handleInputChange} type="text" placeholder="URL Image that contains the face" />
                    <Button disabled={isLoading} onClick={onButtonSubmit} type="submit">Detect</Button>
                </div>
            </div>
            {showFaceComponent && <FaceRecognition imageUrl={input} box={box} />}

        </div >
    );
}

export default ImageLinkForm;