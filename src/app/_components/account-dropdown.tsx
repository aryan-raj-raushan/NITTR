import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { signOut, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { UserPermissionRole } from "@prisma/client";
export default function AccountDropdown() {
  const { data: session } = useSession();
  const user = session ? session.user : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <div>
          <div>
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios-glyphs/30/user--v1.png"
              alt="user--v1"
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user ? user.name : "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/myBookings">
          <DropdownMenuItem>My bookings</DropdownMenuItem>
        </Link>
        {user?.role == UserPermissionRole.ADMIN ? (
          <Link href={"/admin"}>
            <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
          </Link>
        ) : (
          ""
        )}

        {user ? (
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              signIn();
            }}
          >
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
