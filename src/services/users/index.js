import { Router } from 'express'
import { sendEmail } from '../../utilities/email.js'


const userRouter = Router()


userRouter.post("/sendEmail", async (req, res, next) => {
    try {
        const { email } = req.body

        await sendEmail(email)
        res.send('Email is sent!')
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default userRouter