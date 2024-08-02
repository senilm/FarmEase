import prisma from "../utils/PrismaClient.js";

export const addFarm = async (req, res) => {
    try {
        const {name, desc} = req.body;
        const {id} = req.user;
        if(!name){
            return res.status(400).json({message:"Please provide all the details"})
        }

        const farm = await prisma.farm.create({
            data:{
                name:name,
                description:desc || "",
                users:{
                    connect:{
                        id:id
                    }
                }
            }
        })

        await prisma.userRole.create({
            data:{
                userId:id,
                farmId:farm.id,
                role:"ADMIN"
            }
        })

        const farmWithRole = {
            ...farm,
            role: "ADMIN"
        };

        return res.status(201).json({message:"Successfully added farm", farm:farmWithRole});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error, Please try again later"})
    }
}

export const getAllFarm = async (req, res) => {
    try {
        const farms = await prisma.farm.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })

        return res.status(200).json({ farms });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error, Please try again later"})
    }
}

export const getSingleUsersFarm = async (req, res) => {
    try {   
        const {userId} = req.params;

        if(!userId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const farms = await prisma.farm.findMany({
            where:{
                userIds:{
                    has:userId
                }
            }
        })

        return res.status(200).json({ farms });

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error, Please try again later"})

    }
}

export const deleteFarm = async (req, res) => {
    try {
        const {farmId} = req.params;

        if(!farmId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const farm = await prisma.farm.delete({
            where:{
                id:farmId
            }
        })

        return res.status(200).json({ message: "Successfully deleted farm", farm });

    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Farm does not exist" });
        }
        return res.status(500).json({message:"Internal Server Error, Please try again later"})
    }
}

export const updateFarm = async (req, res) => {
    try {
        const {farmId} = req.params;
        const {name, desc} = req.body;

        if(!farmId || !name){
            return res.status(400).json({message:"Please provide required details"})
        }

        const farm = await prisma.farm.update({
            where:{
                id:farmId
            },
            data:{
                name:name,
                description: desc
            }
        })

        return res.status(200).json({ message: "Successfully updated farm", farm });

    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Farm does not exist" });
        }
        return res.status(500).json({message:"Internal Server Error, Please try again later"})
    }
}

export const addUserToFarm = async (req, res) => {
    try {
        const {farmId} = req.params;
        const {userId, role} = req.body;

        const doesFarmExists = await prisma.farm.findFirst({
            where:{
                id:farmId
            }
        })

        if(!doesFarmExists){
            return res.status(404).json({message:"Farm does not exist"})
        }

        const doesUserExists = await prisma.user.findFirst({
            where:{
                id:userId
            }
        })

        if(!doesUserExists){
            return res.status(404).json({message:"User does not exist"})
        }

        const existingUserRole = await prisma.userRole.findUnique({
            where: {
                userId_farmId: {
                    userId: userId,
                    farmId: farmId
                }
            }
        });

        if (existingUserRole) {
            return res.status(400).json({ message: "User already assigned to this farm with a role" });
        }

        const createUserRole = await prisma.userRole.create({
            data:{
                userId:userId,
                farmId:farmId,
                role:role
            }
        })

        await prisma.user.update({
            where: { id: userId },
            data: { farmIds: { push: farmId } }
        });

        await prisma.farm.update({
            where: { id: farmId },
            data: { userIds: { push: userId } }
        });

        return res.status(201).json({message:"Successfully added user", userRole: createUserRole})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error, Please try again later"})
    }
}