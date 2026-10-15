import express from "express"
import { addUser,getUser,getSingleUser,deleteUser,updateUser,login } from "../controller/userDataController.js"
import authanticateToken from "../utils/authMiddlware.js"
import uploadMiddleware from "../utils/uploadMiddleware.js"


const route = express.Router()
route.post('/api/add-user',uploadMiddleware.single("image"),addUser)
route.get('/api/get-userdata',authanticateToken,getUser)
route.get('/api/get-singleuser/:uid',authanticateToken,getSingleUser)
route.delete('/api/delete-user/:uid',authanticateToken,deleteUser)
route.put('/api/update-user/:uid',uploadMiddleware.single("image"),updateUser)
route.post('/api/login',login)

export default route