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
        const {name,value} = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is Required",{status:401});
        }
        if(!value){
            return new NextResponse("Value is Required",{status:401});
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

        const size = await prismadb.size.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
        });
        return NextResponse.json(size);
        
    } catch (error) {
        console.log('[SIZES_POST] ',error);
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
        
       


        const sizes = await prismadb.size.findMany({
            where:{
                storeId:params.storeId
            }
        });
        return NextResponse.json(sizes);
        
    } catch (error) {
        console.log('[SIZES_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}