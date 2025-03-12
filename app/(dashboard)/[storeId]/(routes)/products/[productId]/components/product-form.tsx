"use client";

import { AlertModal } from "@/components/modals/alert-modal";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


import { zodResolver } from "@hookform/resolvers/zod";

import {  Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from 'zod';


interface ProductFormProps{
    initialData:Product & {
        images:Image[]
    }|null;
    categories:Category[];
    colors:Color[];
    sizes:Size[];
}

const formSchema = z.object({
    name:z.string().min(1),
    images:z.object({url: z.string()}).array(),
    price:z.coerce.number().min(1),
    categoryId:z.string().min(1),
    description:z.string().min(1),
    colorId:z.string().min(1),
    sizeId:z.string().min(1),
    isFeatured:z.boolean().default(false).optional(),
    isArchived:z.boolean().default(false).optional()
})

type ProductFormValues = z.infer<typeof formSchema>;


export const ProductForm:React.FC<ProductFormProps> = ({
    initialData,categories,colors,sizes})=>{

    const params = useParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [open,setOpen] = useState(false);
    const [loading,setLoading] = useState(false);

    const title = initialData?"Edit product":"Create product";
    const description = initialData?"Edit a product":"Add a new product";
    const toastMessage = initialData?"Product updated.":"Product created.";
    const action = initialData?"Save Changes.":"Create";


    const form = useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData ? {...initialData,
            price:parseFloat(String(initialData?.price))
        }: {
            name:'',
            images:[],
            price:0,
            categoryId:'',
            description:'',
            colorId:'',
            sizeId:'',
            isFeatured:false,
            isArchived:false
        }
    });
    const onSubmit = async(data:ProductFormValues)=>{
        try {
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
            }else{
                await axios.post(`/api/${params.storeId}/products`,data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            
            toast.success("Store Deleted.")
            router.push(`/${params.storeId}/products`)
        } catch (error) {
            toast.error("Make sure you removed all products using this billboard first.");
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
            <FormField
                        control={form.control}
                        name="images"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload value={field.value.map((image)=>image.url)} disabled={loading} onChange={(url)=>field.onChange([...field.value,{url}])} onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url!==url),{url}])}/>
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name" {...field} />
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                    
                    {/* Price */}
                
                    <FormField
                        control={form.control}
                        name="price"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                    {/* Desc */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product description" {...field} />
                                    </FormControl>
                                <FormMessage/>
                            </FormItem>;
                        }}
                    />
                    {/* Categories */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Select a Cateory"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    categories.map((category)=>(
                                                        <SelectItem value={category.id} key={category.id}>
                                                            {category.name}
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
                    {/* Sizes */}
                    <FormField
                        control={form.control}
                        name="sizeId"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Select a Size"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    sizes.map((size)=>(
                                                        <SelectItem value={size.id} key={size.id}>
                                                            {size.name}
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
                    {/* Colors */}
                    <FormField
                        control={form.control}
                        name="colorId"
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Select a Color"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    colors.map((color)=>(
                                                        <SelectItem value={color.id} key={color.id}>
                                                            {color.name}
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
                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({field})=>{
                            return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                      <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange}/>

                                    </FormControl>  
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear in Home page
                                        </FormDescription>
                                    </div>
                                </FormItem>);
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="isArchived"
                        render={({field})=>{
                            return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                      <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange}/>

                                    </FormControl>  
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in store
                                        </FormDescription>
                                    </div>
                                </FormItem>);
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