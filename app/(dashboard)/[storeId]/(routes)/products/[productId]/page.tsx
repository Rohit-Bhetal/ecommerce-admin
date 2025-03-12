import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductsPage= async({
    params
}:{
    params: Promise<{ productId: string, storeId: string }> 
})=>{
    const { storeId, productId } = await params;
    const product = await prismadb.product.findUnique({
        where:{
            id:productId
        },
        include:{
            images:true
        }
    });
    const sizes = await prismadb.size.findMany({
        where:{
            storeId:storeId
        }
    })
    const categoreis = await prismadb.category.findMany({
        where:{
            storeId:storeId
        }
    })
    const colors = await prismadb.color.findMany({
        where:{
            storeId:storeId
        }
    })
    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm initialData={product} categories={categoreis} colors={colors} sizes={sizes} />
            </div>
        </div>
    )
}

export default ProductsPage;