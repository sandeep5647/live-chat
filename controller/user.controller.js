import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/generateToken.js";

// user registration

export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }
    //hasshing password
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    
    await newUser.save();
    if(newUser){
      createTokenAndSaveCookies(newUser._id,res);
      res.status(201).json({ message: "User created successfully",user:{
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email
      } });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//user login

export const login=async (req, res) => {
  const{email, password} = req.body;
  try {
      const user=await User.findOne({email})
         if(!user){
           return res.status(400).json({error: "User not found"});
         }
      const isMatch=await bcrypt.compare(password,user.password)
         if(!isMatch){
            return res.status(400).json({error: "Incorrect password"});
         }
      createTokenAndSaveCookies(user._id, res);
      
      res.status(200).json({message: "User logged in successfully",user:{
        _id:user._id,
        fullname:user.fullname,
        email:user.email
      }});
    

  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
  }
}

// user logout

export const logout = async(req, res)=>{
  try {
    res.clearCookie("jwt")
    res.status(200).json({message: "User logged out successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const fileteredUser = async (req, res) =>{
  try {
    const loggedInUser=req.user._id;
    const fileteredUser = await User.find({_id:{$ne: loggedInUser}}).select('-password');
    res.status(201).json({ message: "All Users",fileteredUser });
  
  } catch (error) {
     console.log("Error in AllUser Controller: "+ error);
  }
}

