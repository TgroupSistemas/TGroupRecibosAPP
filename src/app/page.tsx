"use client"

import Navbar from "../components/Navbar";
import { Producto } from "../app/Modelo";
import Categoria from "../components/Categoria";
import { UpdateTriggerProvider } from "../app/context"; // Import the UpdateTriggerProvider
import EmpresaBoton from "@/components/EmpresaBoton";

import { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/AppContext';

export default function Home() {
  const { loginUser, responseLogin, loggedIn, isLoggedIn, itHasPassword, getClases, hasPassw, getUsername, getName} = useAppContext();
  const [hasPass, setHasPass] = useState(true );
  const [user, setUser] = useState("Usuario");
  const [name, setName] = useState("Usuario");
  const fetchname = async () => {
    const username = await getName();
    setName(username);
  };
  const fetchUsername = async () => {
    const username = await getUsername();
    setUser(username);
  };
  if(isLoggedIn()){

    
    fetchUsername();
    fetchname();

  }
  useEffect(() => {
    setHasPass(hasPassw)

    const checkLoginStatus = async () => {
      try {
        const logged = await isLoggedIn();
        const hasPassword = await itHasPassword();
        if (logged == false) {
          window.location.replace('/login');
        }
        if(hasPassword == true){
          setHasPass(true)
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
  }, [loggedIn, isLoggedIn, hasPassw]);
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
     <EmpresaBoton setShowPopupAgregar={() => {}}></EmpresaBoton>
    </div>
  </div>
</section>
      
    </UpdateTriggerProvider>
  );
}