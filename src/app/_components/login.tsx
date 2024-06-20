"use client";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Bounce, toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import LoginWithGoogle from "./auth/loginWithGoogle";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Invalid Password",
  }),
});
export default function Login() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res?.ok) {
      toast.error("Invalid email or password.", {
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
    } else {
      toast("You have successfully logged in!", {
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
      router.push("/");
    }
  }

  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   const { email, password } = data;

  //   const res = await signIn("credentials", {
  //     email,
  //     password,
  //     callbackUrl: "/",
  //   });

  //   if (!res?.ok) {
  //     toast.error("Invalid email or password.", {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //   } else {
  //     toast("You have successfully logged in!", {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //     });
  //   }
  // }

  return (
    <Card className="flex flex-col items-center  justify-center gap-5 p-2 text-sm md:p-7">
      <div>Login or Signup</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-2xl"
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>Forgot your Password</div>
          <div className="grid w-full grid-cols-2  gap-3">
            <Button type="submit" className="col-span-1 rounded-3xl">
              Login
            </Button>
            <Link className="w-full " href="/registration">
              <Button type="button" className="col-span-1 w-full rounded-3xl">
                Signup
              </Button>
            </Link>
          </div>
        </form>
      </Form>

      <div className="flex w-full items-center justify-center gap-1 text-xs">
        <div className="h-[1px] w-[30%] bg-gray-300"></div>
        <div>Or Continue With</div>
        <div className=" h-[1px] w-[30%] bg-gray-300"></div>
      </div>
      <div className="flex w-full items-center justify-center gap-3">
        <LoginWithGoogle />
      </div>
    </Card>
  );
}

//<button onClick={() => { handleSubmit({ email: "admin", password: "admin" }) }}>login</button>
