import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{colorId:string,storeId:string}}
){
    try {

        const {userId} = await auth();
        const body = await req.json();
        const {name,value} = body;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400})
        }
        if(!value){
            return new NextResponse("Value is required",{status:400})
        }
        if(!params.colorId){
            return new NextResponse("SIZE ID is required",{status:400})
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
        const color = await prismadb.color.updateMany({
            where:{
                id:params.colorId,
                
            },
            data:{
                name,
                value
            }
        });
        return NextResponse.json(color)

    } catch (error) {
        console.log('[COLORS_PATCH] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try {

        const {userId} = await auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.colorId){
            return new NextResponse("Color ID is required",{status:400})
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
        const color = await prismadb.color.deleteMany({
            where:{
                id:params.colorId,
                
            }
   
        });
        return NextResponse.json(color)

    } catch (error) {
        console.log('[COLORS_DELETE] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(
    req:Request,
    {params}:{params:{colorId:string}}
){
    try {

        
        if(!params.colorId){
            return new NextResponse("Color ID is required",{status:400})
        }
         
        const cplor = await prismadb.color.findUnique({
            where:{
                id:params.colorId,
                
            }
   
        });
        return NextResponse.json(cplor)

    } catch (error) {
        console.log('[COLORS_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}