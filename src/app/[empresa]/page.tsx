"use client"

import Navbar from "@/components/Navbar";
import { Producto } from "@/app/Modelo";
import Categoria from "@/components/Categoria";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import PDFViewer from "@/components/PDFViewer";
import PopUpDoc from "@/components/PopUpDoc";
import { useRouter } from "next/router";
import ReciboCard from "@/components/ReciboCard";
import { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/AppContext';
interface Recibo {
  ARCHIVO: string;
  ESTADO_FIRMA: string;
  FECHA_ESTADO_FIRMA: string | null;
  FEC_ULT_ACT: string;
  FK_SUE_LIQUIDACIONES: number;
  FK_WS_CLIENTES: string;
  FK_WS_USUARIOS: string;
  ID: string;
  MOTIVO_DISCONFORMIDAD: string;
  NUM_RECIBO: number;
  PERIODO: string;
  STATUS_API: string;
  TIP_LIQ: string;
}
interface ReciboCardProps {
  recibo: Recibo;
  index: number;
}

export default function Home() {

  const { loginUser, responseLogin, loggedIn, isLoggedIn, itHasPassword, getClases, hasPassw, getUsername, getName, getRecibosS, recibosLoading, recibos} = useAppContext();
  
  const [user, setUser] = useState("Usuario");
  const [name, setName] = useState("Usuario");
  const [path, setPath] = useState('');

  useEffect(() => {

    if(isLoggedIn()){

    
      fetchUsername();
      fetchname();
      fetchRecibos();
  
    }
}, []);
  const fetchUsername = async () => {
    const username = await getUsername();
    setUser(username);
  };
  const fetchname = async () => {
    const username = await getName();
    setName(username);
  };
  const fetchRecibos = async () => {

    const empresa = window.location.pathname.substring(1);
    getRecibosS(empresa);
};

  return (
    <UpdateTriggerProvider> 
      <Navbar></Navbar>
      <section>

      <div className="container mx-auto bg-white p-8 mt-10 rounded-lg shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold"></h1>
            <p className="text-gray-600">{user}</p>
            <p className="text-gray-600">{name}</p>
        </div>
        
        <div className="space-y-4">
        {!recibosLoading ? (
             recibos.map((recibo: Recibo, index: number) => (
              <ReciboCard recibo={recibo} index={index} />
            ))
        ) : (
            <div>Cargando...</div>
        )}

            <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="mx-4 text-gray-500">Firmá tus recibos pendientes para acceder a los nuevos</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>
           
        </div>
    </div>
      </section>
    </UpdateTriggerProvider>
    
  );
}