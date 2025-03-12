
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import toast from "react-hot-toast";

interface DashboardType {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>
}

export default async function DashBoardLayout({children, params}: DashboardType){
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