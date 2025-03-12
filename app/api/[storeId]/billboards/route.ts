import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {

        const {userId} = await auth();

        
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
        if(!params.storeId){
            return new NextResponse("StoreId is Required",{status:401});
        }
        
        const storeByUserId = await prisma?.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("UnAuthorized Access to the Store",{status:401});
        }

        const billboard = await prismadb.billBoard.create({
            data:{
                label,
                imageUrl,
                storeId:params.storeId
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
    {params}:{params:{storeId:string}}
){
    try {

        
        if(!params.storeId){
            return new NextResponse("StoreId is Required",{status:401});
        }
        
       


        const billboards = await prismadb.billBoard.findMany({
            where:{
                storeId:params.storeId
            }
        });
        return NextResponse.json(billboards);
        
    } catch (error) {
        console.log('[BILLBOARD_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}