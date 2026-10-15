import userData from '../model/user.js'
import bcrypt from 'bcrypt'
import genrateToken from '../utils/jwtutils.js'
import cloudinary from '../config/cloudinary.js'

const uploadToCloudinary = (buffer) =>{
    return new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {
                folder:'images'
            },
            (error,result)=>{
                if(error) return reject(error)
                    resolve(result)

            }
        )
        stream.end(buffer)
    })
}

export const addUser = async(req,res)=>{
    try{
        let image = ""
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer)
            image = result.secure_url
        }
        // console.log("Api call successfully")
        const password = await bcrypt.hash(req.body.password,10)
        const saveuserData = {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:password,
            address:req.body.address,
            image:image
        }
        const saveUser = await userData.create(saveuserData)

        try{
            const brevoRes = await fetch("http://api.brevo.com/v3/smtp/email",{
                headers:{
                    'api-key' : process.env.BREVO_API_KEY,
                    'content-type' : "aplication/json",
                },
                body:JSON.stringify({
                    sender:{name:'My App',email:'umangmemakiya302@gmail.com'},
                    to:[{email:req.body.email}],
                    subject : "test email",
                    htmlContent:"<p>Welcome to our website page!</p>"
                })
            })
            if(!brevoRes.ok){
                console.error("brevo email faild:",brevoRes.status,await brevoRes.text())
            }

        }catch(emailError){
            console.error('brevo email error:',emailError.message)
        }

        res.status(200).json({"message":"data added successfully",data:saveUser})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }
}

export const getUser = async(req,res)=>{
    try{
        const getUserData = await userData.find()
        res.status(200).json({"message":"get data successfully",data:getUserData})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }

}

export const getSingleUser = async(req,res)=>{
    try{
        const id = req.params.uid
        const uData = await userData.findById(id)
        res.status(200).json({"message":"get data successfully",data:uData})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }

}

export const deleteUser = async(req,res)=>{
    try{
        const id = req.params.uid
        const deleteUserData = await userData.findByIdAndDelete(id)
        res.status(200).json({"message":"data delete successfully",data:deleteUserData})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }

}

export const updateUser = async(req,res)=>{
    try{
        const id = req.params.uid
        const saveuserData = {
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address
        }
        const updateUserData = await userData.findByIdAndUpdate(id,saveuserData,{new:true,runValidators:true})
        res.status(200).json({"message":"data update successfully",data:updateUserData})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }

}

export const login = async(req,res)=>{
    try{
        const uData = await userData.findOne({email:req.body.email})
        if (!uData){
            return res.status(200).json({"message":"user not found!",status:0})
        }
        const compass = await bcrypt.compare(req.body.password,uData.password)
        if (!compass){
            return res.status(200).json({"message":"passowrd incract!",status:0})
        }

        const token = await genrateToken(uData)

        res.status(200).json({"message":"user login success!",data:uData,token:token,status:1})
    }
    catch(error){
        res.status(500).json({"message":error.message})
    }
}