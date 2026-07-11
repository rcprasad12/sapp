import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {prisma} from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers : [
        Credentials({
            credentials: {
                email : {label : "Email", type : "email", placeholder : "Enter your email"},
                password : {label : "Password", type : "password", placeholder : "Enter your password"}

            } ,

        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                return null;
        }
        const user = await prisma.user.findUnique({
            where : { email : credentials.email as string},
        });
        
        if(!user || !user.password) {
            return null;
        }
        const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password as string
        );
        if(!passwordMatch) {
            return null;
        }
        return {
            id : user.id,
            email : user.email,
            name : user.username,
        };
        },
        }),
    ],
    pages : {
        signIn : "/login",
    },
    session : {
        strategy : "jwt",
    },
    
});