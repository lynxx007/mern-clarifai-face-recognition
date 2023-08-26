import { useState } from 'react';
import ParticlesBg from 'particles-bg';
// import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/LoginForm/LoginForm';
import Register from './components/RegisterForm/RegisterForm';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import axios from 'axios';



const App = () => {


  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.fullName,
      email: data.email,
      entries: data.entries,
      joined: data.createAt
    });
  }

  const calculateFaceLocation = (data) => {
    console.log(data.data.predictedConcepts.outputs[0].data.regions)
    let dataRegions = []
    const clarifaiFace = data.data.predictedConcepts.outputs[0].data.regions
    if (Array.isArray(clarifaiFace)) {
      clarifaiFace.forEach(item => dataRegions.push(item.region_info.bounding_box))
    }

    const image = document.getElementById('inputimage');
    let box = []
    const width = Number(image.width);
    const height = Number(image.height);
    dataRegions.forEach(item => {
      box.push({
        leftCol: item.left_col * width,
        topRow: item.top_row * height,
        rightCol: width - (item.right_col * width),
        bottomRow: height - (item.bottom_row * height)
      })
    })
    console.log(box)
    return box
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = async () => {
    setImageUrl(input);
    const response = await axios.get('api/v1/image/predict', {
      params: { imageUrl: imageUrl }
    })
    console.log(response)
    displayFaceBox(calculateFaceLocation(response))
  }


  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
    }
    else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <ParticlesBg type="fountain" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home'
        ? <div>
          <Logo />
          <Rank
            name={user.name}
            entries={user.entries}
          />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}

          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
          route === 'signin'
            ? <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )
      }
    </div>
  );
}

export default App;
