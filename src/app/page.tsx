"use client"

import Navbar from "../components/Navbar";
import { UpdateTriggerProvider } from "../app/context"; // Import the UpdateTriggerProvider
import EmpresaBoton from "@/components/EmpresaBoton";
import MailPassword from "@/components/MailPassword";
import { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/AppContext';
import { json } from "stream/consumers";
interface Empresa {
  FEC_ULT_ACT: Date | null;
  FK_SUE_LEGAJOS: number;
  FK_WS_CLIENTES: string;
}
export default function Home() {
  const { loginUser, responseLogin, loggedIn, isLoggedIn, itHasPassword, getClases, hasPassw, getUsername, getName, getEmpresasHab} = useAppContext();
  const [hasPass, setHasPass] = useState(true );
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState<Empresa[]>([]);
  const [loadingEmpresa , setLoadingEmpresa] = useState(true);
  const fetchname = async () => {
    const username = await getName();
    setName(username);
  };
  const fetchUsername = async () => {
    const username = await getUsername();
    setUser(username);
  };
  const fetchEmpresas = async () => {
    setLoadingEmpresa(true);
    const username = await getEmpresasHab();
    console.log(username)
    setEmpresa(JSON.parse(username) as Empresa[]);
    setLoadingEmpresa(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        if(isLoggedIn()){

    
          fetchUsername();
          fetchname();
          fetchEmpresas();
      
        }
        const logged = await isLoggedIn();
        const hasPassword = await itHasPassword();
        setHasPass(hasPassw)

        if (logged == false) {
          window.location.replace('/login');
        }
        if(hasPassword == true){
          setHasPass(true)
          console.log("hasPass", hasPass)

        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      }

    };
    checkLoginStatus()
    const getClasesForHome = async () => {
      try {
        await getClases();
      } catch (error) {
        console.error("Failed to check login status:", error);
      }

    };
    
    getClasesForHome()
  }, [hasPassw]);
  return (
    <UpdateTriggerProvider> 
      
        <Navbar />
        <section className="text-gray-600 bg-white body-font">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-col text-center w-full mb-20">
      <h4 className=" text-indigo-500 tracking-widest font-medium title-font mb-1">{user}</h4>
      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">{name}</h1>
    </div>
    <h3 className="pl-4 text-left mb-5 font-bold">Elegí una empresa</h3>
    <div className="flex flex-wrap -m-4 " >

    {!loadingEmpresa && empresa.map((item, index) => (
      console.log("a",empresa),
        <EmpresaBoton
          key={index}
          empresa={item.FK_WS_CLIENTES}
        />
      ))}
    </div>
  </div>
</section>
  {!hasPass && <MailPassword />}
    </UpdateTriggerProvider>
  );
}