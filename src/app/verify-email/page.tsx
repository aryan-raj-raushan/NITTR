"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "~/components/ui/spinner";
import { verifyMail } from "~/utils/url/authurl";

type QueryParams = {
  id: string | null;
  token: string | null;
};


const VerifySuccess = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState<QueryParams>({ id: null, token: null });
 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = params.get("token");
    setQuery({ id, token });
  }, []);

  const verifyMailAddress = async () => {
    setLoading(true);
    try {
      
      const response = await verifyMail({
        user_id: query.id,
        token: query.token,
      });

      if(response.code ===200){
        toast.success("Your Email Is Verified", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      toast.warn("Failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      router.push("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query?.id && query?.token) {
      verifyMailAddress();
    }
  }, [query?.id, query?.token]);

  return (
    <div className="flex h-screen items-center justify-center text-primary opacity-50">
      {loading && <Spinner size={50} />}
    </div>
  );
};

export default VerifySuccess;
