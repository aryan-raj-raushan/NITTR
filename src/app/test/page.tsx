import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Page() {
  const session = await getServerAuthSession();
  return <main className="flex min-h-screen flex-col items-center justify-center ">
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
      </h1>
      <div className="flex flex-col items-center gap-2">

        {JSON.stringify({

          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        })}
        {JSON.stringify(session)}
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
        <Button>test mail</Button>
      </div>


    </div>
  </main>

}
//
//
// return <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#967bb6] to-[#15162c] text-white">
