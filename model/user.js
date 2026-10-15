import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:false,
    },
    password:{
        type:String,
        required:false,
    },
    address:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    }

},{
    timestamps:true,
    collection:'userdata'
})
export default mongoose.model('userData',userSchema)