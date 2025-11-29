// this controller has two functions to test authentication and admin authorization
// imports
import jwt from "jsonwebtoken";

// function to test if user is logged in
export const shouldBeLoggedIn= async (req,res)=>{
  // get token from cookies
  const token=req.cookies.token;
  console.log(req.userId);
  // if no token, user is not authenticated
  if(!token){
    return res.status(401).json({message:"Not authenticated!"});
  }
  // if token is valid, user is authenticated
  return res.status(200).json({message:"You are authenticated" ,userId:req.userId});
}

// function to test if user is admin
export const shouldBeAdmin= async (req,res)=>{
  // get token from cookies
  const token=req.cookies.token;
  // if no token, user is not authenticated
  if(!token){
    return res.status(401).json({message:"Not authenticated!"});
  }

  // verify token and check if user is admin
  jwt.verify(token,process.env.jwt_secret_key,(err,payload)=>{
    if(err){
      return res.status(403).json({message:"Not valid"});
    }
    if(!payload.isAdmin){
      return res.status(403).json({message:"You are not admin"});
    }

    return res.status(200).json({message:"You are authenticated as an admin"});
  })
}