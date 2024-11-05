import {prisma} from "../database.js";

export const getDropbox = async (req, res) => {
    const dropbox = await prisma.dropbox.findMany()

    return res.json({ data: dropbox });
};