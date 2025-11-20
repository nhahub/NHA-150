import jwt from "jsonwebtoken";
export const shouldBeLoggedIn= async (req,res)=>{
  const token=req.cookies.token;
  console.log(req.userId);
  return res.status(200).json({message:"You are authenticated" ,userId:req.userId});

  
}
export const shouldBeAdmin= async (req,res)=>{
  const token=req.cookies.token;
  if(!token){
    return res.status(401).json({message:"Not authenticated!"});
  }
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