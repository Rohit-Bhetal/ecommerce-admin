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
        const {
            name,
            description,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is Required",{status:401});
        }
        if(!images || !images.length){
            return new NextResponse("Image is Required",{status:401});
        }
        if(!price){
            return new NextResponse("Price is Required",{status:401});
        }
        if(!categoryId){
            return new NextResponse("CategoryId is Required",{status:401});
        }
        if(!sizeId){
            return new NextResponse("SizedId is Required",{status:401});
        }
        if(!colorId){
            return new NextResponse("ColorId is Required",{status:401});
        }
        if(!description){
            return new NextResponse("Description is Required",{status:401});
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

        const product = await prismadb.product.create({
            data:{
                name,
                description,
                price,
                categoryId,
                colorId,
                sizeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                },
                isArchived,
                isFeatured,
                storeId:params.storeId
            }
        });
        return NextResponse.json(product);
        
    } catch (error) {
        console.log('[PRODUCT_POST] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}


export async function GET(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId")||undefined;
        const colorId = searchParams.get("colorId")||undefined;
        const sizeId = searchParams.get("sizeId")||undefined;
        const isFeatured = searchParams.get("isFeatured");
        
        if(!params.storeId){
            return new NextResponse("StoreId is Required",{status:401});
        }
        
       


        const product = await prismadb.product.findMany({
            where:{
                storeId:params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured:isFeatured?true:undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                color:true,
                size:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        return NextResponse.json(product);
        
    } catch (error) {
        console.log('[PRODUCT_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}