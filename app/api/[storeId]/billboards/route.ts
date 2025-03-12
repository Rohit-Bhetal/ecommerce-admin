import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req:Request,
    { params }: { params: Promise<{ storeId: string }> }
){
    try {

        const {userId} = await auth();

        const { storeId } = await params; 
        const body = await req.json();
        const {label,imageUrl} = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!label){
            return new NextResponse("Label is Required",{status:401});
        }
        if(!imageUrl){
            return new NextResponse("Image is Required",{status:401});
        }
        if(!storeId){
            return new NextResponse("StoreId is Required",{status:401});
        }
        
        const storeByUserId = await prisma?.store.findFirst({
            where:{
                id:storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("UnAuthorized Access to the Store",{status:401});
        }

        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeId:storeId
            }
        });
        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARD_POST] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}


export async function GET(
    req:Request,
    { params }: { params: Promise<{ storeId: string }> }
){
    try {

        const { storeId } = await params; 

        if(!storeId){
            return new NextResponse("StoreId is Required",{status:401});
        }
        
       


        const billboards = await prismadb.billboard.findMany({
            where:{
                storeId:storeId
            }
        });
        return NextResponse.json(billboards);
        
    } catch (error) {
        console.log('[BILLBOARD_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}