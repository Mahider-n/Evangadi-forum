
// db connection
const dbConnection=require("../db/dbConfige")
const bcypt=require('bcrypt');
const {StatusCodes}=require('http-status-codes')

const jwt =require('jsonwebtoken');


async function register(req,res){
    const {username,firstname,lastname,email,password}=req.body
    
    if(!email || !password || !firstname || !lastname || !username){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all required informations!"})
    }

    try {
        const [user] =await dbConnection.query("select username,userid from users where username=? or email=?",[username,email])
        // return res.json({user:user})
        if(user.length>0){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"User already exist"})

        }
        if(password.length<=8 ){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"Password must be at least 8 charachters"})
        }


        // encrypt the password
        const salt =await bcypt.genSalt(10)

        const hashedPassword=await bcypt.hash(password,salt)
        await dbConnection.query("INSERT INTO users(username,firstname,lastname,email,password) VALUES(?,?,?,?,?)",[username,firstname,lastname,email,hashedPassword])
        return res.status(StatusCodes.CREATED).json({msg:"User registerd"})

    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something went wrong,try again later"})
        
    }



    // res.send("register")
}

async function login(req,res){
     // requirments 
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid , password FROM users WHERE email = ?",
      [email]
    );

    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential" });
    }
    // compare password
    const isMatch = await bcypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential" });
    }

    // Generate JWT token use to user hold in signin
    const username = user[0].username;
    const userid = user[0].userid;
    const secret = process.env.JWT_SECRET;
    // console.log(username, userid);
    const token = jwt.sign({ username, userid }, secret, {
      expiresIn: "1d", // token expires within 1 day
    });

    // Return the token and success message
    return res.status(StatusCodes.OK).json({
      msg: "User logged in successfully",
      token: token,
      username
    });
    

  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong,try again later!",});
  }
    
}

async function checkUser(req,res){
  const username=req.user.username
  const userid =req.user.userid

  res.status(StatusCodes.OK).json({msg:"valid user",username,userid})
    // res.send("check user")
}

// export 

module.exports={register,checkUser,login}