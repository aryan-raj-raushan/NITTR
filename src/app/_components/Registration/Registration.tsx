"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { sendMail } from "~/lib/mail";
import { Bounce, toast } from "react-toastify";

import crypto from 'crypto';

function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export const AuthCredentialsValidator = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long.",
    }),
    email: z.string().email(),
    number: z.string(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      return ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "The passwords did not match",
      });
    }
  });

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export const LoginCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  callback: z.string().optional(),
});

export type TLoginCredentialsValidator = z.infer<
  typeof LoginCredentialsValidator
>;
interface RegisterComponentProps {
  callbackUrl: string;
}
export default function RegisterComponent({
  callbackUrl,
}: RegisterComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const router = useRouter();

  const sendMailMutation = api.mail.sendMail.useMutation();

  const { mutate } = api.auth.createUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("Conflict", {
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
        return;
      }

      if (err instanceof ZodError) {
        toast.error("Invalid Credentials", {
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
        return;
      }

      toast.error("Failed", {
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
    },
    onSuccess: async ({ email, password }) => {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: callbackUrl ? callbackUrl : "/",
      });

    // Generate verification token (implement this function)
    const verificationToken = generateVerificationToken();

    // Construct verification URL
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

    // Send verification email
    sendMailMutation.mutate(
      {
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      },)

      // sendMailMutation.mutate({
      //   subject: "Registration NITTTR",
      //   text: "You have successfull logged into NITTTR/hostels",
      //   to:email
      // });

      toast("You have successfully registration", {
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
    },
  });

  const onSubmit = async ({
    name,
    email,
    number,
    password,
    confirmPassword,
  }: TAuthCredentialsValidator) => {
    mutate({ name, email,number, password, confirmPassword });
  };

  // const { mutate: createUser } = api.auth.createUser.useMutation({
  //   onSuccess: async ({ email, password }: TAuthCredentialsValidator) => {
  //     await signIn('credentials', { email, password, callbackUrl: callbackUrl ?? '/' });

  //     // Generate verification token (you should implement this function)
  //     const verificationToken = generateVerificationToken();

  //     // Construct verification URL
  //     const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

  //     // Send verification email
  //     const templatePath = 'path/to/verification_email.hbs'; // Replace with your actual path
     
  //     const result = await sendMail({
  //       to: email,
  //       subject: 'Email Verification',
  //       text: verificationUrl,
  //       templatePath,
  //     });

  //     if (result.success) {
  //       toast('Registration successful. Verification email sent.', {
  //         position: 'top-center',
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'light',
  //         transition: Bounce,
  //       });
  //     } else {
  //       toast.error('Failed to send verification email', {
  //         position: 'top-center',
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'light',
  //         transition: Bounce,
  //       });
  //     }
  //   },
  //   onError: (error) => {
  //     // Handle registration errors
  //     console.error('Registration error:', error);
  //     toast.error('Registration failed', {
  //       position: 'top-center',
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: 'light',
  //       transition: Bounce,
  //     });
  //   },
  // });


  // const onSubmit = (data: TAuthCredentialsValidator) => {
  //   createUser(data);
  // };


  return (
    <>
      <form
        className="my-6 w-full space-y-6 md:w-[25%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              {...register("name")}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="block w-full rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors?.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              {...register("email")}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors?.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Phone Number
          </label>
          <div className="mt-2">
            <input
              {...register('number')}
              id="number"
              name="number"
              type="string"
              autoComplete="number"
              required
              className="block w-full rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          {errors?.number && (
            <p className="text-sm text-red-500">Phone number is required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              {...register("password")}
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors?.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block w-full rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors?.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
          {errors?.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor="remember-me"
              className="ml-3 block text-sm leading-6 text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm leading-6">
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </Button>
        </div>
      </form>
    </>
  );
}
 