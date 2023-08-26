import { grpc, ClarifaiStub } from 'clarifai-nodejs-grpc'
import 'dotenv/config'



export const clarifaiApiCallUrl = (imageUrl) => {
    const stub = ClarifaiStub.grpc()

    const metadata = new grpc.Metadata()
    metadata.set("authorization", `Key ${process.env.PAT}`)

    stub.PostModelOutputs({
        user_app_id: {
            "user_id": process.env.USER_ID,
            "app_id": process.env.APP_ID
        },
        model_id: process.env.MODEL_ID,
        inputs: [
            { data: { image: { url: imageUrl, allow_duplicate_url: true } } }
        ]
    },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
        })
}
