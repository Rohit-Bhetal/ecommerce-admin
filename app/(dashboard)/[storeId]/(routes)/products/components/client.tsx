"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import { ProductColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



interface ProductClientProps{
    data:ProductColumn[]
}
export const ProductClient:FC<ProductClientProps> = ({
    data
})=>{
    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Products ${data.length}`}
                description="Manage products for your store"
            />
            <Button onClick={()=>router.push(`/${params.storeId}/products/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="API" description="API calls for Products"/>
        <Separator/>
        <ApiList entityName="products" entityIdName="productId"/>
        </>
    )
}