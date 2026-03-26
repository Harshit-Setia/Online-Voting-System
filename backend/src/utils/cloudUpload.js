import {v2 as cloudinary} from "cloudinary"
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "./constants"


cloudinary.config({
    cloud_name:CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret:CLOUD_API_SECRET
})


export const uploadImage=(buffer)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream(
            {folder:"candidates"},
            (error,result)=>{
                if(error)reject(error)
                else resolve(result)
            }
        ).end(buffer)
    })
}