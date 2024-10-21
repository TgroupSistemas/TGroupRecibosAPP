"use client";

import Navbar from "../components/Navbar";
import { UpdateTriggerProvider } from "../app/context"; // Import the UpdateTriggerProvider
import EmpresaBoton from "@/components/EmpresaBoton";
import MailPassword from "@/components/MailPassword";

import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { json } from "stream/consumers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import ChangePassword from "@/components/ChangePassword";
interface Empresa {
  FEC_ULT_ACT: Date | null;
  FK_SUE_LEGAJOS: number;
  FK_WS_CLIENTES: string;
}
export default function Home() {
  const {
    loginUser,
    mailVerificadoCambio,
    getCookie,
    responseLogin,
    loggedIn,
    isLoggedIn,
    itHasPassword,
    getClases,
    hasPassw,
    getUsername,
    getName,
    getEmpresasHab,
    tycCambio,
    vdpCambio,
  } = useAppContext();
  const [hasPass, setHasPass] = useState(true);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState<Empresa[]>([]);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const [mailVerificado, setMailv] = useState<string>("");
  const [tycState, setTycState] = useState<string>("");
  const [verificaDatos, setVerificaDatos] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [verifLoading, setVerifLoading] = useState(true);
  const [overlayContra, setOverlayContra] = useState(false);
  const handleButtonClick = () => {
    setOverlayContra(true); 
  };
  const [mailLoading, setMailLoading] = useState(true);
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
    console.log(username);
    setEmpresa(JSON.parse(username) as Empresa[]);
    setLoadingEmpresa(false);
  };
  const fetchMail = async () => {
    setMailLoading(true);
    const emailUser = await getCookie("mailverificado");
    setMailv(emailUser);
    const email = await getCookie("mail");
    setMail(email || "");
    await fetchTYC()
    setMailLoading(false);
  };
  const fetchVdp = async () => {
    const vdp = await getCookie("vdp");
    setVerificaDatos(vdp);
  };
  const fetchTYC = async () => {
    const tyc = await getCookie("tyc");
    setTycState(tyc);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setVerifLoading(true);
        if (isLoggedIn()) {
          await fetchUsername();
          await fetchname();
          await fetchEmpresas();
          await fetchMail();
          await fetchVdp();
        }
        const logged = await isLoggedIn();
        const hasPassword = await itHasPassword();
        setHasPass(hasPassw);

        if (logged == false) {
          window.location.replace("/login");
        }
        if (hasPassword == true) {
          setHasPass(true);
          console.log("hasPass", hasPass);
        }
        setVerifLoading(false);

      } catch (error) {
        window.location.replace("/login");

        console.error("Failed to check login status:", error);

      }
    };
    checkLoginStatus();
    const getClasesForHome = async () => {
      try {
        await getClases();
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };

    getClasesForHome();
  }, [hasPassw, mailVerificadoCambio, tycCambio, vdpCambio]);
  return (
    <UpdateTriggerProvider>
      {verifLoading ? (<></>) : (
        <>
      <Navbar />
      <section className="text-gray-600 pt-20 bg-white body-font">
        <div className="container px-5  py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h4 className=" text-indigo-500 tracking-widest font-medium title-font mb-1">
              {user}
            </h4>
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              {name}
            </h1>
          </div>
          <h3 className="pl-4 text-left mb-5 font-bold">Elegí una empresa</h3>
          <div className="flex flex-wrap -m-4 ">
            {!loadingEmpresa &&
              empresa.map(
                (item, index) => (
                  console.log("a", empresa),
                  (<EmpresaBoton key={index} empresa={item.FK_WS_CLIENTES} />)
                )
              )}
          </div>
        </div>
        <button
          className="fixed bottom-4 right-4 bg-indigo-500 hover:bg-indigo-400 transition duration-200 text-white p-4 rounded-full shadow-lg"
          onClick={handleButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <FontAwesomeIcon icon={faKey} className="h-6 w-6" />
          </svg>
        </button>
        {(mailVerificado != "true" || tycState != "true" || (verificaDatos != "F" && verificaDatos != "X")) && !mailLoading && (
        <MailPassword hasPass={hasPass} mail={mail} mailv={mailVerificado} tyc={tycState} vdp={verificaDatos} />
      )}
      </section>

      {overlayContra && (
        <ChangePassword setPopUpOpen={setOverlayContra}></ChangePassword>
      )}
    </>)}

    </UpdateTriggerProvider>
  );
}
