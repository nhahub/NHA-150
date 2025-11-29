// this file contains the controllers for user authentication: registration, login, and logout.
// imports
import bcrypt from "bcrypt";    // for password hashing
import prisma from '../lib/prisma.js';
import jwt from "jsonwebtoken";   // for generating JWT tokens

// controller for user registration
export const register = async (req, res) => {

    const { username, email, password } = req.body; // extract user details from request body

    // check if user with the same username or email already exists
    try{
        const hashedPassword = await bcrypt.hash(password, 10); // hash the password with a salt round of 10
        
        // create new user in the database with hashed password
        const newUser = await prisma.user.create({             
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // respond with success message and user details
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
    // handle errors during registration
        console.error('register error', err);
        return res.status(500).json({ error: 'failed to create user' });
    } 
};


// controller for user login
export const login= async (req,res)=>{
    const {username,password}=req.body;  // extract login credentials from request body
    try{
        // find user by username in the database
        const user = await prisma.user.findUnique({
            where:{username}
        });
        
        // if user not found, respond with error
        if(!user){
            return res.status(401).json({message:"Invalid username!"});
        }

        // else if the user is found, compare provided password with stored hashed password
        const ispasswordValid= await bcrypt.compare(password,user.password);

        // if password is invalid, respond with error
        if(!ispasswordValid){
            return res.status(401).json({message:"Invalid password!"});
        }

        // if password is valid, generate JWT token using the user id with age of 7 days 
        const age=1000*60*60*24*7;
        const token=jwt.sign({
            id:user.id
        },process.env.jwt_secret_key,{
            expiresIn:age
        });

        // set the token in an HTTP-only cookie and respond with user details
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: age,
        }).status(200).json({
            // respond with user details and token
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
        // handle errors during login
        return res.status(500).json({ error: 'failed to login' });
    }

}
export const logout=(req,res)=>{
    // clear the authentication token cookie to log the user out
    res.clearCookie("token").status(200).json({message:"logout successfully!"})
}