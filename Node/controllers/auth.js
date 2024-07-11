import { comparePassword, generateJWT, generateHashPassword } from '../utils/loginUtils.js'
import prisma from '../utils/PrismaClient.js';

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email, password)
        
        if(!email || !password){
            return res.status(400).json({message:"Please provide required details"})
        }  

        // check for email in db
        // if not present then throw error saying user does not exist
        const doesUserExists = await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if(!doesUserExists){
            return res.status(404).json({message:"User does not exist"})
        }

        // get the user and compare the password
        // if not matched then throw error saying invalid credential
        const passwordResponse = await comparePassword(password, doesUserExists.password);

        if(!passwordResponse){
            return res.status(404).json({message:"Invalid Credentials"})
        }

        // if matched then generate token and return that token
        const token = generateJWT(email, doesUserExists.id);
        if(!token){
            return res.status(500).json({message:"Failed to generate Token"})
        }


        return res.status(200).json({message:"Login Successful", token:token, type:doesUserExists.role})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error?.message ? error.message : "Internal server error, Please try again later"})
    }  
}


export const register = async (req, res) => {
    try {
        const {email, password, name} = req.body;
        
        if(!email || !password || !name){
            return res.status(400).json({message:"Please provide required details"})
        }  

        const doesUserExists = await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if(doesUserExists){
            return res.status(404).json({message:"Email already in use"})
        }

        const hashedPassword = await generateHashPassword(password);

        const user = await prisma.user.create({
            data:{
                email:email,
                password:hashedPassword,
                name:name
            }
        })
        if(!user){
            return res.status(500).json({message:"Failed to register user"})
        }

        return res.status(200).json({message:"User registered successfully"})
    } catch (error) {
        console.error(error)
        return res.status(200).json({message:error?.message ? error.message : "Internal server error, Please try again later"})
    }
}
