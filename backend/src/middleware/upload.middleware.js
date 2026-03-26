import multer from "multer"

const storage=multer.memoryStorage() // stores in RAM

const upload=multer({
    storage,
    limits:{
        fileSize:2*1024*1024 // 2MB
    },
    fileFilter:(req,file,cb)=>{ // allows only images
        if(!file.mimetype.startsWith("image/")){
            return cb(Error("Only image files are allowed"),false)
        }
        cb(null,true)
    }
})

export default upload