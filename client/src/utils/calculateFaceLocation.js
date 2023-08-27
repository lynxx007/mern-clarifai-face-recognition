export const calculateFaceLocation = (data) => {
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
    return box
}