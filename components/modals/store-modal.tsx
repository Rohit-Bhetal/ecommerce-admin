"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreModal } from "@/hooks/use-store-modal";;

import * as z from 'zod';

import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";


import { Form,
         FormControl,
         FormField, 
         FormItem, 
         FormLabel, 
         FormMessage } from "@/components/ui/form";
         
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const formSchema = z.object({
    name:z.string().min(1),

})
export const StoreModal =()=>{
    const storeModal = useStoreModal();
    const [loading,setLoading]= useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:""
        }

    })
    const onSubmit = async(values:z.infer<typeof formSchema>)=>{
        try {
            setLoading(true);
            
            const response = await axios.post('/api/stores',values);
            window.location.assign(`/${response.data.id}`)
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Something went wrong.")
        }
        finally{
            setLoading(false);
        }
    }
    return (
    <Modal
        title="Create Store"
        description="Add a new store to manage products and categories"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>{
                        return <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Your Store Name" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>;
                    }}
                    />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button disabled={loading} variant={"outline"} onClick={storeModal.onClose}>Cancel</Button>
                        <Button disabled={loading} type='submit' >Next</Button>
                    </div>

                </form>
            </Form>
        </div>

    </Modal>)
}