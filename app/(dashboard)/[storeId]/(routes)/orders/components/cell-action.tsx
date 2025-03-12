"use client"

import { FC, useState } from "react";
import { BillboardColumn } from "./column"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps{
    data:BillboardColumn;
}

export const CellAction:FC<CellActionProps> =({
    data
})=>{
    const router = useRouter();
    const params= useParams();
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);

    const onCopy = (id:string)=>{
        navigator.clipboard.writeText(id);
        toast.success("Copied Id.");
    }
    const onDelete = async()=>{
        try {

            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            
            toast.success("BillBoard Deleted.")
            
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
            console.log(error);
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal isOpen={open} onConfirm={onDelete} loading={loading} onClose={()=>setOpen(false)}/>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="font-thin" onClick={()=>onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4 font-thin"/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/billboards/${data.id}`)} className="font-thin">
                        <Edit className="mr-2 h-4 w-4 font-thin"/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(true)} className="font-thin">
                        <Trash className="mr-2 h-4 w-4 font-thin"/>
                        Trash
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
         </>
    )
}