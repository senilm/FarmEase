import prisma from "../utils/PrismaClient.js"

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                email:true
            }
        })

        if(users.length == 0){
            return res.status(200).json({users:[]});
        }
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({message:"Failed to fetch users, Please try again later"})
    }
}

