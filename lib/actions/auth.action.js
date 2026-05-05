'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { success } from "zod"

const ONE_WEEK = 60*60*24*7

export async function signup(params){

    const  {uid, name, email} = params

    try{

        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success : false,
                message: "User alreaduy exists, Try Signing in instead"
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return{
            success : true,
            message: "Account Created Successfully. Please Sign-In"
        }

    }catch(error){
        if (error.code === "auth/email-already-exists"){
            return{
                success: false,
                message : "Email already in use, try using a different one."
        }

        
        }else{
            return {
                success: false,
                message: "Sign up Failed"
            }
        }
    }


}

export async function setSessionCookie(idToken){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session', sessionCookie, {

        maxAge : ONE_WEEK,
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        path : "/",
        sameSite : 'lax'

    })

}

export async function signin(params){

    const {email, idToken} = params;

    try{

        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: "User does not exist. Create an Account"
            }
        }

        await setSessionCookie(idToken)

        return {
            success: true,
            message: "Signed in successfully"
        }


    }catch(error){
        return {
            success: false,
            message : "Failed to Log-In, try again"
        }
    }

} 

export async function getCurrentUser(){
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie){
        return null;

    }

    try{

        const decodeClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodeClaims.uid).get()

        if(!userRecord.exists){
            return null
        }

        return{
            ...userRecord.data(),
            id : userRecord.id

        }


    }catch(error){

        console.log(error);
        return null
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}