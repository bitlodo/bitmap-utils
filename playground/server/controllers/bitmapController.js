import { DB } from "../config/db.js";

export const getBitmapReq = async (req, res) => {

    const id = req.params.id;

    if (isNaN(id) || id >= 840000 || id < 0) {
        res.send({ success: false, error: "Invalid Bitmap" })
        return;
    } 

    try {
        const result = await DB.all(`SELECT bitmap, size, tx FROM bitmaps where bitmap = ${id}`);
        res.send({ success: true, data: result[0] });
    } catch (err) {
        console.log(err.message)
        res.send({ success: false, error: "Internal server error" })
    }
}