import prismadb from "@/lib/prismadb";
import { FC } from "react";


interface DashBoardPageProps{
    params:{storeId:string}
}
const DashboardPage:FC<DashBoardPageProps> = async({
    params
})=>{
    const store = await prismadb.store.findFirst({
        where:{
            id:params.storeId
        }
    });
    return (
        <div>
            Active Store:{store?.name}
        </div>
    )
}

export default DashboardPage;