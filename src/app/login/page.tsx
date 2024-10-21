"use client"
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Producto } from "@/app/Modelo";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useAppContext } from '@/contexts/AppContext';
import ForgotPassword from "@/components/ForgotPassword";
export default function Home() {
  const { loginUser, responseLogin, postLogRecibo, logLoading, loggedIn, isLoggedIn } = useAppContext();
  const [dni, setDNI] = useState<string>("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const response = await loginUser({
      dni, // Make sure to use the state variables here
      password
    });
    if (!response) {
      setLoading(false);

      setError("Error al iniciar sesión. Por favor, verifique los datos ingresados.");
  }
    
  }
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const logged = await isLoggedIn();
        if (logged == true) {
          window.location.replace('/');
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };
    checkLoginStatus()
  }, [loggedIn, isLoggedIn]);


  return (
    <UpdateTriggerProvider> 
      
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto mt-2 h-30 w-auto" src="/img/logoTitulo-02.jpg" alt="TGroup logo"/>
      <h2 className="mt-2 text-center text-xl font-bold leading-9 tracking-tight text-gray-600">Accedé a tu cuenta</h2>
    </div>
  
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dni" className="block text-sm font-medium leading-6 text-gray-900">DNI</label>
          <div className="mt-2 flex">
            <input id="dni" name="dni" type="number" onChange={e => setDNI(e.target.value)}   required className="block  w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>

          </div>
        </div>  
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
            <button onClick={() => setOpenForgot(true)} type="button"  className="text-sm font-medium text-indigo-600 hover:text-indigo-500">¿Olvidaste tu contraseña?</button>

          </div>
          <div className="mt-2">
            <input id="password"  name="password" onChange={e => setPassword(e.target.value)}  type="password" autoComplete="current-password" className="block bg-white pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>
        <div className="text-red-500">{}</div>

        {error && <span className="text-red-500">{error}</span>}

        <div>
          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acceder</button>
        </div>
      </form>
      {loading && <div className="flex justify-center">
               <span className="loading loading-infinity loading-lg"></span>
             </div>}
    </div>
      
  </div>
  {openForgot && <ForgotPassword setPopUpForgotOpen={setOpenForgot}></ForgotPassword>}
    </UpdateTriggerProvider>
  );

}