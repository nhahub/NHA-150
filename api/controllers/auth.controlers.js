import bcrypt from "bcrypt";
import prisma from '../lib/prisma.js';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    const { username, email, password } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

      
        res.status(201).json({
            message: 'User created',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar || null,
                createdAt: newUser.createdAt,
            },
        });
    }catch(err){
        console.error('register error', err);
        return res.status(500).json({ error: 'failed to create user' });
    }
};


export const login= async (req,res)=>{
    const {username,password}=req.body;
    try{
        const user = await prisma.user.findUnique({
            where:{username}
        });
        if(!user){
            return res.status(401).json({message:"Invalid username!"});
        }
        const ispasswordValid= await bcrypt.compare(password,user.password);
        if(!ispasswordValid){
            return res.status(401).json({message:"Invalid password!"});
        }

        const age=1000*60*60*24*7;
        const token=jwt.sign({
            id:user.id
        },process.env.jwt_secret_key,{
            expiresIn:age
        });

        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({
            message: "login successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
                createdAt: user.createdAt,
            },
            token,
        });
    }catch(err){
        return res.status(500).json({ error: 'failed to login' });
    }

}
export const logout=(req,res)=>{
    res.clearCookie("token").status(200).json({message:"logout successfully!"})
}