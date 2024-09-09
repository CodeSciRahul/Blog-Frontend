"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" }),
  content: z
    .string({ message: "Content is required" })
  
});


type FormSchema = z.infer<typeof formSchema>;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const CreatePost = ({ params }: { params: { user_id: string } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user_id = params.user_id;
  const access_token = localStorage.getItem("access_token");
  const token = access_token ? JSON.parse(access_token) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  console.log(`${baseURL}/api/${user_id}`);

  // Form submission handler
  const onSubmit = async (values: FormSchema) => {
    setIsSubmitting(!isSubmitting)
    try {
      const response = await fetch(`${baseURL}/api/${user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      
      if (!response.ok){
        setIsSubmitting(!isSubmitting)
        return toast.error(`${data?.message}`, { duration: 5000 });
      } 
      toast.success(`${data?.message}`, { duration: 5000 });
      setIsSubmitting(!isSubmitting)
      router.push('/')
    } catch (error) {
      toast.error(`Error: ${error}`, { duration: 5000 });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>Fill in the details below to create a new blog post.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Title Input */}
            <div>
              <Label htmlFor="title" className="text-lg font-medium">
                Post Title
              </Label>
              <Input
                id="title"
                placeholder="Enter post title"
                {...register("title")}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Content Input */}
            <div>
              <Label htmlFor="content" className="text-lg font-medium">
                Post Content
              </Label>
              <textarea
                id="content"
                placeholder="Write your post content here..."
                {...register("content")}
                className="mt-1 w-full h-40 border border-gray-300 rounded-lg p-2 resize-none"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
          <Button type="submit" className=" bg-[#164674] hover:bg[#164674] hover:opacity-90" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Creat Post"}
          </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
};

export default CreatePost;
