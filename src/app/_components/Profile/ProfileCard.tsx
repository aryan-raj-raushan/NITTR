"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Bounce, toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { useAppSelector } from "~/store";

const FormSchema = z.object({
  name: z.string().optional(),
  number: z.string().optional(),
  email: z.string().email().optional(),
});

const ProfileCard = () => {
  const { name, number, email } = useAppSelector((store: any) => store.auth);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name || "",
      number: number || "",
      email: email || "",
    },
  });

  const updateProfileMutation = api.auth.updateProfile.useMutation({
    onSuccess: async ({ guest }: any) => {
      toast("You have successfully updated your profile", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      const updatedSession = await signIn("credentials", {
        email: form.getValues("email"),
        redirect: false,
      });

      if (updatedSession?.error) {
        console.error("Error updating session:", updatedSession.error);
      }
    },
  });

  useEffect(() => {
    form.reset({
      name: name || "",
      number: number || "",
      email: email || "",
    });
  }, [name, number, email]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    updateProfileMutation.mutate(data);
  }

  return (
    <section>
      <div>
        <h1 className="text-center text-[2rem] font-bold">
          Update Your Profile
        </h1>
        <div className="mx-auto w-full border p-4 mt-5 rounded-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="sm:w-2/3 w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-2xl"
                        type="text"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-2xl"
                        type="text"
                        placeholder="Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-2xl"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid w-full grid-cols-2 gap-3">
                <Button type="submit" className="col-span-1 rounded-3xl">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
