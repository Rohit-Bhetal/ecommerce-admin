import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/column";
import {format} from 'date-fns'

const BillboardsPage = async({
    params
}:{
    params: Promise<{ storeId: string }>
})=>{
    const { storeId } = await params;
    const billboards = await prismadb.billBoard.findMany({
        where:{
            storeId:storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    const formattedBillboards:BillboardColumn[] = billboards.map((item)=>(
        {
            id:item.id,
            label:item.label,
            createdAt:format(item.createdAt,"MMMM do, yyyy")
        }
    ))

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage;