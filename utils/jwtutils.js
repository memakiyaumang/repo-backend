import jwt from 'jsonwebtoken'
import secretKey from '../jwtConfig.js'


const genrateToken = (user) =>{
    const payload = {
        id:user._id,
        email:user.email
    }
    return jwt.sign(payload,secretKey,{expiresIn:'24h'})
}

export default genrateToken