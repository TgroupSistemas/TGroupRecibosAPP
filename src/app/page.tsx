"use client";

import Navbar from "../components/Navbar";
import { UpdateTriggerProvider } from "../app/context";
import EmpresaBoton from "@/components/EmpresaBoton";
import MailPassword from "@/components/MailPassword";

import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faXmark } from "@fortawesome/free-solid-svg-icons";
import ChangePassword from "@/components/ChangePassword";

interface Empresa {
  FEC_ULT_ACT: Date | null;
  FK_SUE_LEGAJOS: number;
  FK_WS_CLIENTES: string;
  DESCRIPCION: string;
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
    getEmpresasHab2,
    tycCambio,
    vdpCambio,
    // NEW: unread notifications
    traerNumeroNotisNoLeidas,
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
  const [mailLoading, setMailLoading] = useState(true);

  // NEW: notifications
  const [unreadNotis, setUnreadNotis] = useState<number>(0);
  const [notifDismissed, setNotifDismissed] = useState(false);

  const handleButtonClick = () => setOverlayContra(true);

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
    const username2 = await getEmpresasHab2();
    setEmpresa(username2 as Empresa[]);
    setLoadingEmpresa(false);
  };
  const fetchMail = async () => {
    setMailLoading(true);
    const emailUser = await getCookie("mailverificado");
    setMailv(emailUser);
    const email = await getCookie("mail");
    setMail(email || "");
    await fetchTYC();
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

          // NEW: fetch unread notifications (ignore errors silently)
          try {
            const n = await traerNumeroNotisNoLeidas();
            setUnreadNotis(Number(n) || 0);
          } catch (e) {
            setUnreadNotis(0);
          }
        }
        const logged = await isLoggedIn();
        const hasPassword = await itHasPassword();
        setHasPass(hasPassword);

        if (logged == false) {
          window.location.replace("/login");
        }
        if (hasPassword == true) {
          setHasPass(true);
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

  // Compute whether the MailPassword component is currently shown
  const showMailPassword = useMemo(() => {
    return (
      (mailVerificado != "true" ||
        tycState != "true" ||
        (verificaDatos != "F" && verificaDatos != "X")) &&
      !mailLoading
    );
  }, [mailVerificado, tycState, verificaDatos, mailLoading]);

  // Show the notif popup only when MailPassword is NOT visible, unread > 0, and not dismissed
  const showNotifPopup = !showMailPassword && unreadNotis > 0 && !notifDismissed;


  return (
    <UpdateTriggerProvider>
      {verifLoading ? (
        <></>
      ) : (
        <>
          <Navbar />

          {/* NON-INVASIVE NOTIF POPUP (top-left) */}
          {showNotifPopup && (
            <div
              className="fixed bottom-5 left-5 md:left-auto md:bottom-auto md:right-24 md:top-20 z-50 bg-white border border-gray-200 shadow-xl rounded-xl px-4 py-3 flex items-start gap-3 max-w-xs"
              role="status"
              aria-live="polite"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  Tenes <span className="font-semibold">{unreadNotis}</span> notificaciones sin leer
                </p>
                
              </div>
              <button
                onClick={() => setNotifDismissed(true)}
                aria-label="Cerrar"
                className="ml-1 mt-0.5 text-gray-400 hover:text-gray-600"
                title="Cerrar"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          <section className="text-gray-600 pt-20 bg-white body-font">
            <div className="container px-5 py-24 mx-auto">
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
                  empresa.map((item, index) => (
                    <EmpresaBoton
                      key={index}
                      destino={item.FK_WS_CLIENTES}
                      empresa={item.DESCRIPCION}
                    />
                  ))}
              </div>
            </div>

            <button
              className="fixed bottom-4 right-4 bg-indigo-500 hover:bg-indigo-400 transition duration-200 text-white p-4 rounded-full shadow-lg"
              onClick={handleButtonClick}
              title="Cambiar contraseña"
            >
              <FontAwesomeIcon icon={faKey} className="h-6 w-6" />
            </button>

            {(mailVerificado != "true" ||
              tycState != "true" ||
              hasPass == false ||
              (verificaDatos != "F" && verificaDatos != "X")) &&
              !mailLoading && (
                <MailPassword
                  hasPass={hasPass}
                  mail={mail}
                  mailv={mailVerificado}
                  tyc={tycState}
                  vdp={verificaDatos}
                />
              )}
          </section>

          {overlayContra && (
            <ChangePassword setPopUpOpen={setOverlayContra} />
          )}
        </>
      )}
    </UpdateTriggerProvider>
  );
}
