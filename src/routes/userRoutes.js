import express from 'express'
import { upload } from '../middleware/imageUploadMiddleware.js'
import { getUser, updateUserData, changePassword } from '../controllers/userContoller.js'
import { JWTValidation } from '../middleware/JWTValidation.js'

const router = express.Router()

router.get('/users', JWTValidation, getUser)
router.patch('/users',JWTValidation, upload.fields([{name: 'ktp', maxCount:1}, {name: 'kk', maxCount: 1}, {name: 'profile_picture', maxCount: 1}]), updateUserData)
router.patch('/users/change-password',JWTValidation, changePassword)

export default router