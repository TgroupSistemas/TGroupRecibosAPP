"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
interface UserData {
  CALLE: string | null;
  CELULARES: string | null;
  CP: string | null;
  CUIL: string | null;
  DEPTO: string | null;
  EMAIL: string | null;
  FULLNAME: string | null;
  LOCALIDAD: string | null;
  NUMERO: string | null;
  PARTIDO: string | null;
  PISO: string | null;
  PROVINCIA: string | null;
  TE: string | null;
  CALZADO: string | null;
  PANTALON: string | null;
  REMERA: string | null;
  ENTRE_CALLES: string | null;
}
export default function Perfil() {
  const { itHasPassword, isLoggedIn, getCookie, traerDatosPerfil } = useAppContext(); // Assuming user data is available in the context
  const [loading, setLoading] = useState(true);
  const [user, setUserData] = useState<UserData | null>(null);
  const [verifLoading, setVerifLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
    const verifyUser = async () => {
      setVerifLoading(true);

      const hasPassword = await itHasPassword();
      if (!hasPassword) {
        window.location.replace("/");
        return;
      }

      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        window.location.replace("/login");
        return;
      }

      if ((await getCookie("mailverificado")) !== "true") {
        window.location.replace("/");
        return;
      }

      if ((await getCookie("tyc")) !== "true") {
        window.location.replace("/");
        return;
      }
      setVerifLoading(false);
    };
    setLoading(true);
    setUserData(traerDatosPerfil(await getCookie("username")));
    verifyUser();
    setLoading(false);
  setLoading(true);
  await verifyUser();

  const username = await getCookie("username");
  const data = await traerDatosPerfil(username);
  setUserData(data);  
  setLoading(false);
};

fetchData();
}, [itHasPassword, isLoggedIn]);


  return (
    <UpdateTriggerProvider>
      {verifLoading ? (<></>) : (
        <>
      <Navbar />
      {loading ? (
               <div className="flex justify-center">
               <span className="loading loading-infinity loading-lg"></span>
             </div>
      ) : (
      <div className="container mx-auto pt-48 md:pt-38 ">
        <div className="flex flex-col text-center w-full mb-16 ">
          <Link href="/" className="inline-flex items-center px-1 text-lg no-underline text-md mb-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver 
          </Link>
          <h4 className=" text-indigo-500 tracking-widest font-medium title-font mb-1">
          {user?.CUIL ?? "" ? user?.CUIL : "-"}
          </h4>
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            {user?.FULLNAME}
          </h1>
        </div>
        <h2 className="text-xl text-gray-600 text-center font-bold ">Tus datos:</h2>
        <div className="flex justify-center">

        </div>

        <div className="flex justify-center">
          
        <div className="bg-white border-gray-300 border-2 mb-10 rounded-lg lg:w-4/6 md:w-5/6  mt-5 p-8 md:flex-row flex flex-col  flex-nowrap md:flex-wrap ">
          <div className="w-full md:w-1/2 pr-4 md:flex-row flex flex-col justify-center md:justify-around ">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Calle:</label>
                <span>{user?.CALLE ?? "" ? user?.CALLE : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Número:</label>
                <span>{user?.NUMERO ?? "" ? user?.NUMERO : "-"}</span>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Piso:</label>
                <span>{user?.PISO ?? "" ? user?.PISO : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Depto:</label>
                <span>{user?.DEPTO ?? "" ? user?.DEPTO : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">CP:</label>
                <span>{user?.CP ?? "" ? user?.CP : "-"}</span>
              </div>
            </div>
            <div className="md:ml-10">
              <div className="mb-4 ">
                <label className="block text-gray-700 font-bold">
                  Localidad:
                </label>
                <span>{user?.LOCALIDAD ?? "" ? user?.LOCALIDAD : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">
                  Provincia:
                </label>
                <span>{user?.PROVINCIA ?? "" ? user?.PROVINCIA : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">
                  Partido:
                </label>
                <span>{user?.PARTIDO ?? "" ? user?.PARTIDO : "-"}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">
                  Entrecalles:
                </label>
                <span>{user?.ENTRE_CALLES ?? "" ? user?.ENTRE_CALLES : "-"}</span>

              </div>
            </div>
          </div>
          <div className="w-px bg-gray-300 h-2/3 lg:mx-16 md:mx-10"></div>
          <div className="w-30 md:pl-4 mt-10 md:mt-0 md:mb-10 md:mb-0">
            <div className="mb-4 ">
              <label className="block text-gray-700 font-bold">CUIL:</label>
              <span>{user?.CUIL ?? "" ? user?.CUIL : "-"}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Celulares:
              </label>
              <span>{user?.CELULARES ?? "" ? user?.CELULARES : "-"}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Email:</label>
              <span>{user?.EMAIL ?? "" ? user?.EMAIL : "-"}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Teléfono:</label>
              <span>{user?.TE ?? "" ? user?.TE : "-"}</span>
            </div>
          </div>

          <div className="md:ml-10 w-full  md:pl-4 mt-10 md:mt-0 mb-10 md:mb-0 flex md:flex-row flex-col  md:justify-around">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Calzado:
              </label>
              <span>{user?.CALZADO ?? "" ? user?.CALZADO : "-"}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Pantalón:</label>
              <span>{user?.PANTALON ?? "" ? user?.PANTALON : "-"}</span>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Remera:</label>
              <span>{user?.REMERA ?? "" ? user?.REMERA : "-"}</span>
            </div>
          </div>
        </div>

        </div>
      </div>)}
      </>)
      }
    </UpdateTriggerProvider>
  );
}
