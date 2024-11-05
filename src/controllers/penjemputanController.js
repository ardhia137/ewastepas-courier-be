import { raw } from "@prisma/client/runtime/library";
import { prisma } from "../database.js";
import * as yup from "yup";

const acceptPickupRequestSchema = yup.object().shape({
    pickup_status: yup.string().required("Pickup status is required"),
});

export const getCalculatePickupTotals = async (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const monthlyData = [];
    console.log(today)
    try {
        const courierId = 2;
        const totalDelivered = await prisma.pickup_waste.count({
            where: {
                pickup_status: "accepted",
                courier_id: courierId,
                updated_at: { gte: today }
            }
        });

        const totalOnDelivery = await prisma.pickup_waste.count({
            where: {
                pickup_status: "pending",
                courier_id: courierId,
                updated_at: { gte: today }
            }
        });

        const totalCanceled = await prisma.pickup_waste.count({
            where: {
                pickup_status: "cancelled",
                courier_id: courierId,
                updated_at: { gte: today }
            }
        });

        const totalPoints = await prisma.courier_points.findFirst({
            where: {
                courier_id: courierId,
                updated_at: { gte: today }
            },
            select: {
                total_points: true,
            }
        });
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 1);

            const totalMonthDelivered = await prisma.pickup_waste.count({
                where: {
                    pickup_status: "accepted",
                    courier_id: courierId,
                    created_at: {
                        gte: startOfMonth,
                        lt: endOfMonth
                    }
                }
            });

            monthlyData.push({
                month: month + 1,
                totalDelivered: totalMonthDelivered,
            });
        }

        res.json({
            todayTotals: {
                totalDelivered,
                totalOnDelivery,
                totalCanceled,
                totalPoints: totalPoints ? totalPoints.total_points : 0
            },
            monthlyTotals: monthlyData
        });
    } catch (error) {
        console.error("Error fetching calculate pickup:", error);
        res.status(500).json({ error: "An error occurred while fetching calculate pickup" });
    }
}


export const getPickupRequests = async (req, res) => {
    try {
        const courierId = 1;

        const pickups = await prisma.pickup_waste.findMany({
            where: {courier_id: courierId}
        });
        res.json({
            data: pickups,
        });

    } catch (error) {
        console.error("Error fetching pickup requests:", error);
        res.status(500).json({ error: "An error occurred while fetching pickup requests" });
    }
};

export const acceptPickupRequest = async (req, res) => {
    const { id } = req.params;
    const pickupId = parseInt(id, 10);

    if (isNaN(pickupId)) {
        return res.status(400).json({ error: "Invalid pickup ID format" });
    }

    try {
        // Validate request body
        await acceptPickupRequestSchema.validate(req.body);

        const { pickup_status } = req.body;

        const updatedRequest = await prisma.pickup_waste.update({
            where: { pickup_id: pickupId, user_id: req.users.user_id },
            data: { pickup_status },
        });

        if (!updatedRequest) {
            return res.status(404).json({ error: "Pickup request not found" });
        }

        res.json({ data: updatedRequest });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        console.error("Error updating pickup request status:", error);
        res.status(500).json({ error: "An error occurred while updating pickup request status" });
    }
};

export const getPickupHistory = async (req, res) => {
    try {
        const courierId = 1
        const history = await prisma.$queryRawUnsafe(
            `SELECT 
            pw.pickup_id AS pickup_id,
            pw.pickup_date AS pickup_date,
            pw.pickup_address AS pickup_address,
            pw.pickup_status AS pickup_status,
            db.name AS "Drop Box Name",
            db.district_address AS district_address,
            GROUP_CONCAT(DISTINCT wt.waste_type_name) AS waste_type_names,
            GROUP_CONCAT(DISTINCT w.waste_name) AS waste_name,
            GROUP_CONCAT(DISTINCT pd.quantity) AS total_quantity,
            GROUP_CONCAT(DISTINCT pd.points) AS total_points
        FROM 
            pickup_detail pd
        JOIN 
            pickup_waste pw ON pd.pickup_id = pw.pickup_id
        JOIN 
            waste w ON pd.waste_id = w.waste_id
        JOIN 
            waste_type wt ON w.waste_type_id = wt.waste_type_id
        JOIN 
            dropbox db ON pw.dropbox_id = db.dropbox_id
        WHERE 
            pw.courier_id = ${courierId} AND
            pw.pickup_status = 'cancelled'
        GROUP BY 
            pw.pickup_id, 
            pw.pickup_date, 
            pw.pickup_address, 
            pw.pickup_status, 
            db.name, 
            db.district_address
        ORDER BY 
            pw.pickup_date DESC;`
        )
        const transformedHistory = history.map(item => ({
            ...item,
            waste_type_names: item.waste_type_names.split(','),
            waste_name: item.waste_name.split(','),
            total_quantity: item.total_quantity.split(',').map(Number),
            total_points: item.total_points.split(',').map(Number),
        }));

        if (history.length === 0) {
            return res.status(404).json({ error: "No completed pickups found for this user" });
        }

        res.json({
            data: transformedHistory,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        console.error("Error fetching pickup history:", error);
        res.status(500).json({ error: "An error occurred while fetching pickup history" });
    }
};
