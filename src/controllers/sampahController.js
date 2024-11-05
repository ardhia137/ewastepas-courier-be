import { prisma } from "../database.js";
import * as yup from "yup";

const userIdSchema = yup.object().shape({
    id: yup.number().integer().positive().required(),
});

export const getWasteTypes = async (req, res) => {
    try {
        const wasteTypes = await prisma.waste_type.findMany();
        res.json({ data: wasteTypes });
    } catch (error) {
        console.error("Error fetching waste types:", error);
        res.status(500).json({ error: "An error occurred while fetching waste types" });
    }
};

export const getWaste = async (req,res) => {
    const {id} = req.params;
    const wasteTypeId = parseInt(id, 10)
    try {
        const waste = await prisma.waste.findMany({
            where:{
                waste_type_id:wasteTypeId
            },
            
        })
        res.json({data : waste})
    } catch (error) {
        console.error("Error fetching waste:", error);
        res.status(500).json({ error: "An error occurred while fetching waste" });
    }
}
export const getAllWaste = async (req,res) => {
    try {
        const waste = await prisma.waste.findMany()
        res.json({data : waste})
    } catch (error) {
        console.error("Error fetching waste:", error);
        res.status(500).json({ error: "An error occurred while fetching waste" });
    }
}

export const getTotalWaste = async (req, res) => {
    const { id } = req.params;

    // Validate the user ID using yup
    try {
        await userIdSchema.validate({ id });
    } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
    }

    const userId = parseInt(id, 10);

    try {
        const totalWaste = await prisma.users.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                waste_total: true,
            },
        });

        if (!totalWaste) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ data: totalWaste });
    } catch (error) {
        console.error("Error fetching total waste:", error);
        res.status(500).json({ error: "An error occurred while fetching total waste" });
    }
};