

const express=require('express')
const router=express.Router();

// user controllers

const {register,login,checkUser}=require('../controller/userController');
// authentication middleware
const authMiddleware = require('../middleware/authMiddleware');
// register route
router.post("/register",register 
)
// login route
router.post("/login", login)

// check user 
router.get("/check",authMiddleware,checkUser)

module.exports=router 