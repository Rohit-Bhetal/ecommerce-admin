
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import toast from "react-hot-toast";

export default async function DashBoardLayout({
    children,
    params
}:{
    children:ReactNode,
    params:{ storeId: string }
}){
    const {userId} = await auth();
    const { storeId } = await params;
    
    if(!userId){
        redirect('/sign-in');
    }
    
    const store = await prismadb.store.findFirst({
        where:{
            id:storeId,
            userId
        }
    });

    if(!store){
        toast.error('Wrong Store ID.')
        redirect('/')
    }
    return (
        <>
            <Navbar/>
            {children}
        
        </>
    )
}