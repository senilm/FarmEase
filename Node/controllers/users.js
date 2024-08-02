import prisma from "../utils/PrismaClient.js"

export const getUsers = async (req, res) => {
    try {
        const {searchTerm} = req.query;

        const users = await prisma.user.findMany({
            where:{
                name:{
                    startsWith:searchTerm,
                    mode:"insensitive"
                }
            },
            select:{
                id:true,
                name:true,
                email:true,
            }
        })

        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({message:"Failed to fetch users, Please try again later"})
    }
}

export const getFarmUsers = async (req, res) => {
    try {
        const {farmId} = req.params;
        const users = await prisma.farm.findUnique({
            where:{
                id:farmId
            },
            select:{
                users:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        UserRole:{
                            where:{
                                farmId:farmId
                            },
                            select:{
                                role:true
                            }
                        }
                    }
                }
            }
        })

        if (!users) {
            return res.status(404).json({ users: [] });
        }   

       

        const modifiedUsers = users.users.map((user) => {
            return {
                ...user,
                role: user.UserRole[0]?.role 
            };
        }).map(({ UserRole, ...rest }) => rest);

        return res.status(200).json({users:modifiedUsers});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to fetch users, Please try again later"})
    }
}
