import prisma from "../utils/PrismaClient.js"

export const addBooking = async (req, res) => {
    try {
        const {fromDate, toDate, userId, amount} = req.body;

        if(!fromDate || !toDate || !userId || !amount || amount <= 0){
            return res.status(400).json({message:"Please provide all the details"})
        }
        
        if(fromDate > toDate){
            return res.status(400).json({message:"Select valid dates"})
        }
        // Missing cases
        // 1) jo 24 thi 25 nu book hoy ane kok 22 thi 27 kari de book thai jase, je no thavu joie
        // 2) 24 thi 28 book hoy to 25 thi 26 nu book thavu no joie
        const booking = await prisma.booking.create({
            data:{
                fromDate:fromDate,
                toDate:toDate,
                amount:amount,
                User:{
                    connect:{
                        id:userId
                    }
                }
            }
        });

        if(!booking){
            return res.status(400).json({message:"Failed to add booking"})
        }
        
        return res.status(200).json({message:"Successfully added booking"});
    } catch (error) {
        console.error(error)
        if(error.code == "P2002"){
            return res.status(500).json({message:"Already booked!!"})
        }
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const getBookings = async (req, res) => {
    try {
        const {fromDate, toDate, fromAmount,toAmount, page, type, dashboard} = req.query;

        const LIMIT = 6;
        const currentPage = page ? page : 1
        const skip = (currentPage - 1) * LIMIT;
        const {id} = req.user;

        const filters = [];

        if(fromDate){
            filters.push({
                fromDate:{
                    gte:new Date(fromDate),
                }
            })
        }

        if(toDate){
            const endOfDay = new Date(toDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            filters.push({
                fromDate:{
                    lte:endOfDay,
                }
            })
        }
        
        if(fromAmount){
            filters.push({
                amount:{
                    gte:parseInt(fromAmount, 10),
                }
            })
        }

        if(toAmount){
            filters.push({
                amount:{
                    lte:parseInt(toAmount, 10),
                }
            })
        }

        if(type == 'self'){
            filters.push({
                userId:{
                    equals:id,
                }
            })
        }

        const orderObj = [];

        orderObj.push({
            toDate:'desc'
        })

        let bookings = [];

        if(dashboard){
            bookings = await prisma.booking.findMany({
                where: {
                    AND:[...filters]
                },
                include:{
                    User:{
                        select:{
                            name:true
                        }
                    }
                },
                orderBy:orderObj
            });
        }else{
            bookings = await prisma.booking.findMany({
                skip:skip,
                take:LIMIT,
                where: {
                    AND:[...filters]
                },
                include:{
                    User:{
                        select:{
                            name:true
                        }
                    }
                },
                orderBy:orderObj
            });
        }
        const bookingsData = bookings.length == 0 ? [] : bookings
        return res.status(200).json({bookings:bookingsData});
    } catch (error) {
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const getAllBooking = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include:{
                User:{
                    select:{
                        name:true
                    }
                }
            },
            orderBy:{
                toDate:'desc'
            }
        });
        const bookingsData = bookings.length == 0 ? [] : bookings
        return res.status(200).json({bookings:bookingsData});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const getBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        if(!bookingId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const booking = await prisma.booking.findFirst({
            where:{
                id:bookingId
            }
        })
        if(!booking){
            return res.status(404).json({message:"Booking does not exist"})
        }
        return res.status(200).json({booking:booking});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        if(!bookingId){
            return res.status(400).json({message:"Please provide required details"})
        }

        const booking = await prisma.booking.delete({
            where:{
                id:bookingId
            }
        })

        if(!booking){
            return res.status(404).json({message:"Booking does not exist"})
        }

        return res.status(200).json({message:"Successfully deleted booking"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}

export const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const {fromDate, toDate, amount, userId} = req.body

        if(!bookingId || !fromDate || !toDate || !userId || !amount || amount <= 0){
            return res.status(400).json({message:"Please provide required details"})
        }

        const booking = await prisma.booking.update({
            where:{
                id:bookingId
            },
            data:{
                fromDate:fromDate,
                toDate:toDate,
                amount:amount,
                User:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
        if(!booking){
            return res.status(404).json({message:"Failed to update booking"});
        }
        return res.status(200).json({message:"Successfully updated booking"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Interval Server Error, Please try again later"})
    }
}
