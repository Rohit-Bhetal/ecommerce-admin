import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SetupLayout({
    children
}:{
    children:ReactNode
}){
    const {userId} = await auth();
    if(!userId){
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where:{
            userId:userId
        }
    });
    if (store){
        redirect(`/${store.id}`);
    }

    return (
        <>
        {children}
        </>
    )

}