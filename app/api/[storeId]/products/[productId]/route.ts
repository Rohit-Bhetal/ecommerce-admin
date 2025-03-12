import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{productId:string,storeId:string}}
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
        if(!params.productId){
            return new NextResponse("BillBoardId is required",{status:400})
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
        await prismadb.product.update({
            where:{
                id:params.productId,
                
                
            },
            data:{
                name,
                price,
                description,
                categoryId,
                colorId,
                sizeId,
                images:{
                    deleteMany:{

                    }
                },
                isFeatured,
                isArchived
            }
        });
        const product = await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        },
        
    
    )
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try {

        const {userId} = await auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.productId){
            return new NextResponse("productId is required",{status:400})
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
        const product = await prismadb.product.deleteMany({
            where:{
                id:params.productId,
                
            }
   
        });
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_DELETE] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function GET(
    req:Request,
    {params}:{params:{productId:string}}
){
    try {

        
        if(!params.productId){
            return new NextResponse("productId is required",{status:400})
        }
         
        const product = await prismadb.product.findUnique({
            where:{
                id:params.productId,
                
            },include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
   
        });
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_GET] ',error);
        return new NextResponse("Internal Error",{status:500})
    }
}