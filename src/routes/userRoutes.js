// code of routes
import express from 'express'
const router = express();
import { userRegister, getallUser, getUserByid, updateUserbyId, deletUserbyId, login, secureData, sendEmail, resetPasswprd, changePassword } from '../controllers/useControllers.js'
import { authmiddleware } from '../middleWare/authMiddleware.js';

router.post('/register', userRegister);
router.post('/login', login);
router.get('/getalluser', authmiddleware, getallUser);
router.get('/getsecuredata', authmiddleware, secureData);
router.get('/getuserbyid', authmiddleware, getUserByid);
router.put('/updateuserbyid', authmiddleware, updateUserbyId);
router.delete('/deleteuserbyid', authmiddleware, deletUserbyId);
router.get('/secureData', authmiddleware, (req, res) => {
    res.status(500).json({ message: 'secure data is collected', user: req.user })
})
router.post('/send-mail', sendEmail)
router.post('/reset-password', resetPasswprd)
router.post('/change-password', authmiddleware, changePassword)



export default router
