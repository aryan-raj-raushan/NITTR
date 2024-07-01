'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { UserPermissionRole } from "@prisma/client";
import { useAppDispatch, useAppSelector } from "~/store";
import { clearAuthState } from "~/store/authSlice";
import { useRouter } from "next/navigation";

export default function AccountDropdown() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { name, role } = useAppSelector((store: any) => store.auth);
  const isLogin = useAppSelector((state: any) => state.auth.authState);

  const signOut = () => {
    dispatch(clearAuthState());
    router.push("/");
  };

  const signIn = () => {
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <div>
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/ios-glyphs/30/user--v1.png"
            alt="user--v1"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{isLogin ? name : "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLogin && (
          <Link href="/profile">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
        )}

        <Link href="/myBookings">
          <DropdownMenuItem>My bookings</DropdownMenuItem>
        </Link>

        {role === UserPermissionRole.ADMIN && (
          <Link href="/admin">
            <DropdownMenuItem>Admin Dashboard</DropdownMenuItem>
          </Link>
        )}

        {isLogin ? (
          <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={signIn}>Login</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
