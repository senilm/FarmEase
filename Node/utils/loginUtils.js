import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


export const generateJWT = (email, id) => {
    const token = jwt.sign({email, id}, process.env.JWT_SECRET);
    return token;
}


export const comparePassword = async (password, hashedPassword) => {
    const passwordResponse = await bcrypt.compare(password, hashedPassword)
    return passwordResponse;
}


export const generateHashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10)
    return hashed;
}