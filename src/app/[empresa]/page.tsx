"use client";

import Navbar from "@/components/Navbar";
import { Producto } from "@/app/Modelo";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import PDFViewer from "@/components/PDFViewer";
import PopUpDoc from "@/components/PopUpDoc";
import { useRouter } from "next/router";
import ReciboCard from "@/components/ReciboCard";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import ModuloBoton from "@/components/ModuloBoton";

export default function Home() {
  const { getCookie } = useAppContext();
  const [empresa, setEmpresa] = useState<string >("");
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const modulosAccesibles = [
    {
      NOMBRE: "Recibos",
      DIRECCION: "recibos",
    },
    {
      NOMBRE: "Licencias",
      DIRECCION: "licencias",
    }
  ];

  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoadingEmpresa(true);
      const empresa = await getCookie("fl_erp_empresas");
      setEmpresa(empresa);
      setLoadingEmpresa(false);
    };
    fetchEmpresa();
  }, [getCookie]);

  return (
    <UpdateTriggerProvider>
      <Navbar></Navbar>
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
        <h1 className="sm:text-2xl text-2xl text-center mb-10 font-medium title-font text-gray-900">
              Modulos
            </h1>
          <div className="flex flex-wrap -m-4 ">
            {!loadingEmpresa &&
              modulosAccesibles.map(
                (item, index) => (
                  (<ModuloBoton key={index} empresa={empresa} nombre={item.NOMBRE} direccion={item.DIRECCION}  />)
                )
              )}
          </div>
        </div>
      </section>
    </UpdateTriggerProvider>
  );
}
