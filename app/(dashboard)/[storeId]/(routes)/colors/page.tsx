import prismadb from "@/lib/prismadb";
import {  ColorsClient } from "./components/client";
import { ColorColumn } from "./components/column";
import {format} from 'date-fns'

const ColorsPage = async({
    params
}:{
    params: Promise<{ storeId: string }>
})=>{
    const { storeId } = await params;
    const colors = await prismadb.color.findMany({
        where:{
            storeId:storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    const formattedColors:ColorColumn[] = colors.map((item)=>(
        {
            id:item.id,
            name:item.name,
            value:item.value,
            createdAt:format(item.createdAt,"MMMM do, yyyy")
        }
    ))

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
    )
}

export default ColorsPage;