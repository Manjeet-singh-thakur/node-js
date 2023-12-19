// main logic of code
import Jwt from 'jsonwebtoken';
import Userdata from '../models/useModels.js';
import bcrypt, { compare, genSalt } from 'bcrypt';
import { validateEmail, validatePhoneNumber, validatepassword } from '../utils/validation.js';
import envConfig from '../config/envConfig.js';
import transporter from '../middleWare/emailConfig.js';



// userregister api
const userRegister = async (req, res) => {
    try {

        const { userName, email, password, confirmPassword, phoneNumber, address } = req.body;
        if (!userName || !email || !password || !confirmPassword || !phoneNumber || !address) {
            return res.status(404).json({ message: 'all fields are requried' })
        }
        const findUserByemail = await Userdata.findOne({ email })

        if (findUserByemail) {
            return res.status(402).json({ message: 'email already exists' })

        }

        // validations for email 
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            return res.status(404).json({ message: "Not a valid email" })
        }
        const salt = await bcrypt.genSalt(15);
        const hashpassword = await bcrypt.hash(password, salt)
        const hashpasswordconfrim = await bcrypt.hash(confirmPassword, salt);
        const newDoc = new Userdata({
            userName, email, password: hashpassword, confirmPassword: hashpasswordconfrim, phoneNumber, address
        })
        // validation for password 
        const isvaliPassword = validatepassword(password);
        if (!isvaliPassword) {
            return res.status(500).json({ message: 'password must contain one special chracter and one uppercase and one lowercase letter and min lenght of password is  8' });
        }

        if (password !== confirmPassword) {
            return res.status(500).json({ message: "confirm password is not matched with password" })
        }

        const findUserBynumber = await Userdata.findOne({ phoneNumber });

        if (findUserBynumber) {
            return res.status(402).json({ message: 'phonenumber is already exists' })
        }
        // validation for phonenumber
        const isvalidNumber = validatePhoneNumber(phoneNumber);
        if (!isvalidNumber) {
            return res.status(500).json({ message: 'not a valid  phone number enter 10digits number' });
        }


        const saveUser = newDoc.save();
        if (saveUser) {
            return res.status(201).json({ message: 'user register succesfully' });
        } else {
            return res.status(500).json({ message: 'user not register' })
        }



    } catch (error) {
        console.error("Error in user registration")
        return res.status(500).json({ message: 'error in user registration', error })
    }
}



// get all user api 
const getallUser = async (req, res) => {
    try {
        const getUser = await Userdata.find({});
        if (!getUser) {
            return res.status(500).json({ message: 'user not found' })
        } else {
            return res.status(201).json({ message: 'user found', getUser });
        }
    }
    catch (error) {
        console.error("Error in getting user")
        return res.status(500).json({ message: 'error in getting user', error })
    }
}


// get user by id
const getUserByid = async (req, res) => {
    try {
        const userId = req.user?._id
        // console.log(userId)
        const getUserid = await Userdata.findById(userId);
        if (!getUserid) {
            return res.status(404).json({ message: 'user not found' })
        } else {
            return res.status(201).json({ message: "user found by id", getUserid })
        }
    } catch (error) {
        console.error("Error in find user")
        return res.status(500).json({ message: 'error in find user', error })
    }
}

// update user by id

const updateUserbyId = async (req, res) => {
    try {
        const userId = req.user?._id
        const { userName, address } = req.body;
        const updateuser = await Userdata.findByIdAndUpdate(
            userId, { userName, address },
            { new: true });
        if (!updateuser) {
            return res.status(404).json({ message: 'user cant update' });
        } else {
            return res.status(201).json({ message: 'user updated succesfully by id', updateuser })
        }
    } catch (error) {
        console.error("Error in updating user")
        return res.status(500).json({ message: 'user cannot update by id', error })
    }
}
// delete user by id;
const deletUserbyId = async (req, res) => {
    try {
        const userId = req.user?._id
        const delteUser = await Userdata.findByIdAndDelete(userId)
        if (!delteUser) {
            return res.status(500).json({ message: 'user not deleted' })
        } else {
            return res.status(201).json({ message: 'user deleted succesfully', delteUser });
        }
    } catch (error) {
        console.error("Error in updating user")
        return res.status(500).json({ message: 'error in deleting user' });
    }
}


// login api
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findemail = await Userdata.findOne({ email });
        if (!findemail) {
            return res.status(404).json({ message: 'user not exist' });
        }
        const matchpassword = await bcrypt.compare(password, findemail.password)
        if (!matchpassword) {
            return res.status(404).json({ message: 'worng password' });
        }
        const token = Jwt.sign({
            _id: findemail._id,
            userName: findemail.userName,
            email: findemail.email,
            phoneNumber: findemail.phoneNumber,
            address: findemail.address
        }, envConfig.SECRET_KEY, {
            expiresIn: '1h'
        })
        let userData = {
            token: token
        }
        return res.status(201).json({ message: 'login succesfully', userData })
    } catch (error) {
        console.error("Error in login")
        return res.status(500).json({ message: 'login failed', error });
    }
}

// get secure data
const secureData = async (req, res) => {
    try {
        const getsecuredata = await Userdata.find({});

        if (!getsecuredata) {
            return res.status(404).json({ message: "Users  not found" })
        } else {
            return res.status(201).json({ messgae: "Usres found", getsecuredata });

        }

    } catch (error) {
        console.error("Error in User found")
        return res.status(500).json({ message: 'Error in user find', error });
    }
}


// forgot password api 

const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await Userdata.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: 'email not found' })
            }
            else {
                const genToken = Jwt.sign({ _id: user._id }, envConfig.SECRET_KEY, { expiresIn: '1h' });
                const link = `http://localhost:3000/reset-password/?token=${genToken}`;
                await transporter.sendMail({
                    from: envConfig.EMAIL_USER,
                    to: email,
                    subject: 'reset your passsword',
                    html: `click here to reset your password <a href=${link}>click here</a>`
                })
                return res.status(201).json({ messgae: ' email is send plese check your email' })
            }

        }
    }
    catch (error) {
        console.error("Error in sending mail")
        return res.status(500).json({ message: 'mail not sent', error });
    }

}

// reset password 
const resetPasswprd = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    try {
        const token = req.query.token;
        const decode = Jwt.verify(token, envConfig.SECRET_KEY);
        const user = await Userdata.findById(decode._id);

        if (!newPassword) {
            return res.status(404).json({ message: 'newpassword is requried ' });
        }

        if (!confirmPassword) {
            return res.status(404).json({ message: 'confrimpassword is requried ' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(500).json({ message: 'confirm password is requried' })
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const newHashpassword = await bcrypt.hash(newPassword, salt);
            user.password = newHashpassword
            await user.save();
            return res.status(200).json({ message: 'passsword reset succesfully' });
        }
    } catch (error) {
        console.error("Error reset password")
        return res.status(500).json({ message: 'errro in reset password', error });
    }
}

// change password
const changePassword = async (req, res) => {
    try {
        const {oldPassword,newPassword,confirmPassword}=req.body;
        const userId = req.user?._id
        const user = await Userdata.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        const oldpass = await bcrypt.compare(oldPassword, user.password);
        if (!oldpass) {
            return res.status(500).json({ message: 'oldPassword is not matched' })
        }

        if (newPassword !== confirmPassword) {
            return res.status(500).json({ message: 'newpassword is not matched with confirmpassword ' })
        }
        const salt = await bcrypt.genSalt(10)
        const newHashpassword = await bcrypt.hash(newPassword, salt)
        user.password = newHashpassword;
        const updateOne = await Userdata.findByIdAndUpdate(userId, { password: newHashpassword }, { new: true });
        return res.status(200).json({ message: 'oldPassword is updated', updateOne })

    } catch (error) {

    }
}

export { userRegister, getallUser, getUserByid, updateUserbyId, deletUserbyId, login, secureData, sendEmail, resetPasswprd, changePassword };