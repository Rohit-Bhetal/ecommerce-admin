"use client";

import { AlertModal } from "@/components/modals/alert-modal";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


import { zodResolver } from "@hookform/resolvers/zod";

import {  Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from 'zod';


interface CategoryFormProps{
    initialData:Category|null;
    billboards:Billboard[];
}

const formSchema = z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>;


export const CategoryForm:React.FC<CategoryFormProps> = ({
    initialData,billboards})=>{

    const params = useParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const title = initialData?"Edit category":"Create category";
    const description = initialData?"Edit a category":"Add a new category";
    const toastMessage = initialData?"Category updated.":"Category created.";
    const action = initialData?"Save Changes.":"Create";


    const form = useForm<CategoryFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:'',
            billboardId:''
        }
    });
    const onSubmit = async(data:CategoryFormValues)=>{
        try {
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);
            }else{
                await axios.post(`/api/${params.storeId}/categories`,data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    const onDelete = async()=>{
        try {

            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            
            toast.success("Category Deleted.")
            router.push(`/${params.storeId}/categories`)
        } catch (error) {
            toast.error("Make sure you removed all categories using this Category first.");
            console.log(error);
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
        <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading}/>
        <div className="flex items-center justify-between">
            <Heading
                title = {title}
                description = {description}>

            </Heading>
            {initialData&&<Button disabled={loading} variant={'destructive'} size={'icon'} onClick={()=>{setOpen(true)}}>
                <Trash className="h-4 w-4"/>
            </Button>}
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="billboardId"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                    <FormControl>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Select a billboard"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    billboards.map((billboard)=>(
                                                        <SelectItem value={billboard.id} key={billboard.id}>
                                                            {billboard.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
            </form>
        </Form>
        <Separator/>
        </>
    )
}