import { grpc, ClarifaiStub } from 'clarifai-nodejs-grpc'
import 'dotenv/config'



export const clarifaiApiCallUrl = async (imageUrl) => {
    const stub = ClarifaiStub.grpc()

    const metadata = new grpc.Metadata()
    metadata.set("authorization", `Key ${process.env.PAT}`)

    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                user_app_id: {
                    user_id: process.env.USER_ID,
                    app_id: process.env.APP_ID
                },
                model_id: process.env.MODEL_ID,
                version_id: process.env.MODEL_VERSION_ID,
                inputs: [
                    { data: { image: { url: imageUrl, allow_duplicate_url: true } } }
                ]
            },
            metadata,
            (err, response) => {
                if (err) {
                    reject(err);
                }

                if (response.status.code !== 10000) {
                    reject(new Error("Post model outputs failed, status: " + response.status.description));
                }
                resolve(response);
            }
        );
    });
}
