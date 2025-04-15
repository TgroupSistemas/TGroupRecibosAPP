import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "@/contexts/AppContext";
import { useState, useEffect } from "react";
import Logout from "./Logout";
import { get } from "http";
import { set } from "date-fns";
export default function Navbar() {
  const { getName, traerNumeroNotisNoLeidas, getCookie } = useAppContext();
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [numberofNotis, setNumberofNotis] = useState(0);
  const [updateVisible, setUpdateVisible] = useState(false);

  useEffect(() => {
    const fetchname = async () => {
      const username = await getName();
      setName(username);
      const numberofNotis2 = await traerNumeroNotisNoLeidas();
      setNumberofNotis(numberofNotis2);
      console.log("a", await getCookie("fl_erp_empresas"))
      setUpdateVisible(await getCookie("fl_erp_empresas") == "TGROUP"); 
    };
    fetchname();
  }, [getName]);

  return (
    <div className="z-50	fixed w-full">
      <header className="text-black bg-white body-font ">
        <div className="shadownav ">
          <div className="container mx-auto flex flex-wrap p-3 px-5 flex-col  md:flex-row items-center shadow-md">
            <Link
              className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
              href={`/`}
            >
              <img className="h-12 text-white" src="/img/logo.png"></img>
            </Link>
            <nav className="md:ml-auto flex flex-wrap items-center text-black justify-center"></nav>
            <li className="block  text-center px-4 no-underline verdetg font-semibold">
              {"Hola, " +
                name.split(" ")[0].charAt(0).toUpperCase() +
                name.split(" ")[0].slice(1).toLowerCase()}
            </li>
            {updateVisible && (
              <div className="relative">
              <Link
                href="/notificaciones"
                className="block text-center px-2 text-lg no-underline verdetg font-semibold"
              >
                <FontAwesomeIcon icon={faBell} className="mr-2" />
              </Link>
              {numberofNotis > 0 && (
                <span className="absolute top-0 right-0 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {numberofNotis}
                </span>
              )}
              </div>
            )}
            <div className="flex mt-2 md:mt-0">
            <Link
              href="/perfil"
              className="block text-center px-4 text-lg no-underline verdetg font-semibold"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            </Link>
            <li className="block text-center text-lg px-3 no-underline verdetg">
              <a className="lis" href="#" onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </a>
            </li>{" "}
            </div>
          </div>
        </div>
      </header>

      {open && <Logout setPopUpLogoutOpen={setOpen} />}
    </div>
  );
}
