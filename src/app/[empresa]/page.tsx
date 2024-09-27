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
interface Recibo {
  ARCHIVO: string;
  ESTADO_FIRMA: string;
  FECHA_ESTADO_FIRMA: string;
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
const defaultRecibo: Recibo = {
  ARCHIVO: "",
  ESTADO_FIRMA: "",
  FECHA_ESTADO_FIRMA: "",
  FEC_ULT_ACT: "",
  FK_SUE_LIQUIDACIONES: 0,
  FK_WS_CLIENTES: "",
  FK_WS_USUARIOS: "",
  ID: "",
  MOTIVO_DISCONFORMIDAD: "",
  NUM_RECIBO: 0,
  PERIODO: "",
  STATUS_API: "",
  TIP_LIQ: "",
};

interface ReciboCardProps {
  recibo: Recibo;
  index: number;
}
interface Empresa {
  FEC_ULT_ACT: Date | null;
  FK_SUE_LEGAJOS: number;
  FK_WS_CLIENTES: string;
}
export default function Home() {
  const {
    loginUser,
    responseLogin,
    getEmpresasHab,
    loggedIn,
    isLoggedIn,
    itHasPassword,
    getClases,
    hasPassw,
    getUsername,
    getName,
    recibosLoading,
    recibosSinFirmar,
    recibosFirmados,
    getRecibosFirmados,
    getRecibosSinFirmar,
    recibosFirmadosLoading,
    recibosSinFirmarLoading,
    getCookie
  } = useAppContext();

  const [user, setUser] = useState("...");
  const [name, setName] = useState("...");
  const [path, setPath] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const [legajo, setLegajo] = useState(0);
  const [actualRecibo, setActualRecibo] = useState<Recibo>(defaultRecibo);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [empresaSt, setEmpresa] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const empresa = window.location.pathname.substring(1);
        setEmpresa(window.location.pathname.substring(1));
        fetchname();
        fetchRecibosSinFirmar(empresa);
        fetchRecibosFirmados(empresa);

        fetchEmpresas(empresa);
        fetchUsername();
        const hasPassword = await itHasPassword();
        if (hasPassword == false) {
          window.location.replace("/");
        }
        console.log("v", empresa);
      }
      if (!loggedIn ) {
        window.location.replace("/login");
      }
      if (await getCookie("mailverificado") != "true") {
        window.location.replace("/");
      }
      if (await getCookie("tyc") != "true") {
        window.location.replace("/");
      }
    };

    fetchData();
  }, []);

  const fetchUsername = async () => {
    const username = await getUsername();
    setUser(username);
  };
  const fetchname = async () => {
    const username = await getName();
    setName(username);
  };
  const fetchEmpresas = async (empresaSt: string) => {
    setLoadingEmpresa(true);
    const username = await getEmpresasHab();
    const username2 = JSON.parse(username) as Empresa[];
    setEmpresas(JSON.parse(username) as Empresa[]);
    setLoadingEmpresa(false);
    console.log("a", empresas, empresaSt, username);
    setLegajo(
      username2.find((e) => e.FK_WS_CLIENTES == empresaSt)?.FK_SUE_LEGAJOS || 0
    );
  };
  const fetchRecibosFirmados = async (empresa: string) => {
    getRecibosFirmados(empresa);
    console.log(empresas);
  };
  const fetchRecibosSinFirmar = async (empresa: string) => {
    getRecibosSinFirmar(empresa);
  };

  return (
    <UpdateTriggerProvider>
      <Navbar></Navbar>
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold"></h1>
            {!recibosLoading ? (
              <>
                <p className="text-gray-600">{user}</p>
                <p className="text-gray-600 font-bold text-xl">{name}</p>
                <p className="text-gray-600">LEGAJO {legajo}</p>
              </>
            ) : (
              <div className="flex justify-center"></div>
            )}
          </div>

          <div className="space-y-4">
            {!recibosSinFirmarLoading ? (
              recibosSinFirmar.length > 0 ? (
                <>
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">
                      Recibo pendiente mas antiguo
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <ReciboCard
                    key={4324}
                    recibo={recibosSinFirmar[0]}
                    set={setActualRecibo}
                    set2={setPopUpOpen}
                    index={4324}
                    habilitada={true}
                    empresa={window.location.pathname.substring(1)}
                  />
                </>
              ) : (
                <div className="text-center font-bold text-green-500">
                  ¡Ya firmaste todos tus recibos!
                </div>
              )
            ) : (
              <div className="flex justify-center">
                <span className="loading loading-infinity loading-lg"></span>
              </div>
            )}
            {!recibosSinFirmarLoading ? (
              recibosSinFirmar.length > 1 ? (
                <>
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">
                      Firmá tus recibos pendientes para acceder a los nuevos
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  {recibosSinFirmar
                    .slice(1)
                    .map((recibo: Recibo, index: number) => (
                      <ReciboCard
                        key={index}
                        recibo={recibo}
                        set={setActualRecibo}
                        set2={setPopUpOpen}
                        index={index}
                        habilitada={false}
                        empresa={window.location.pathname.substring(1)}
                      />
                    ))}
                </>
              ) : (
                <div className="text-center font-bold text-red-500"></div>
              )
            ) : (
              <div></div>
            )}
            {!recibosLoading ? (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500">Recibos firmados</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </>
            ) : (
              <div></div>
            )}
            {!recibosFirmadosLoading ? (
              recibosFirmados.length > 0 ? (
                <>
                  {recibosFirmados
                    .flat()
                    .map((recibo: Recibo, index: number) => (
                      <ReciboCard
                        key={index}
                        recibo={recibo}
                        set={setActualRecibo}
                        set2={setPopUpOpen}
                        index={index}
                        habilitada={true}
                        empresa={window.location.pathname.substring(1)}
                      />
                    ))}
                </>
              ) : (
                <div className="text-center  text-grey-500">
                  No hay recibos firmados
                </div>
              )
            ) : (
              <div></div>
            )}
          </div>
          {!recibosFirmadosLoading && recibosFirmados[recibosFirmados.length - 1].length == 20 && (console.log("WAWAW",recibosFirmados),
            <div className="flex justify-center">
            <button className="px-10 py-2 bg-gray-300 rounded-lg mt-5 text-md text-green-800 hover:bg-gray-200" onClick={()=> fetchRecibosFirmados(window.location.pathname.substring(1))}>
              Ver más recibos
            </button>
          </div>)}
        </div>
      </section>
      {popUpOpen && (
        <PopUpDoc
        
          reciboRecibido={actualRecibo}
          cerrar={setPopUpOpen}
          empresa={empresaSt}
        ></PopUpDoc>
      )}
    </UpdateTriggerProvider>
  );
}
