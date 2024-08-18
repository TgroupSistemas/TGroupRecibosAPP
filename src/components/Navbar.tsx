
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useAppContext } from '@/contexts/AppContext';

export default function Navbar() {
  const { logout } = useAppContext();

    return (
        <header className="text-black bg-white body-font">
        <div className="shadownav ">
      <div className="container mx-auto flex flex-wrap p-3 px-5 flex-col  md:flex-row items-center shadow-md">
      <Link className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href={`/`}>
        <img className="h-12 text-white" src='/img/logo.png'></img>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-black justify-center">
        </nav>
        <li className="block  text-center px-4 no-underline verdetg font-semibold">{"Hola, Laura"}</li>
  
          <li className="block text-center px-3 no-underline verdetg">
    <a className="lis" href="#" onClick={logout}>
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </a>
  </li>      </div>
      </div>
    </header>
    )
}