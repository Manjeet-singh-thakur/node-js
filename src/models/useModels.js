// code of user schema 
import mongoose from "mongoose";
import express from 'express'


const userSchema = new mongoose.Schema({
    userName: { type: String, require: false },
    email: { type: String, require: false },
    password: { type: String, require: false },
    confirmPassword: { type: String, require: false },
    phoneNumber: { type: Number, require: false },
    address: { type: String, require: false }
});

const Userdata = mongoose.model('Userdata', userSchema)
export default Userdata;    