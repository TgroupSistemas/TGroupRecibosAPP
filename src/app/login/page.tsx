"use client"
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Producto } from "@/app/Modelo";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useAppContext } from '@/contexts/AppContext';

export default function Home() {
  const { loginUser, responseLogin, postLogRecibo, logLoading, loggedIn, isLoggedIn } = useAppContext();

  const [dni, setDNI] = useState<string>("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const response = await loginUser({
      dni, // Make sure to use the state variables here
      password
    });
    if (!response) {
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
      <img className="mx-auto h-14 w-auto" src="/img/logo.png" alt="TGroup logo"/>
      <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Accedé a tu cuenta</h2>
    </div>
  
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
        21949693
          <label htmlFor="dni" className="block text-sm font-medium leading-6 text-gray-900">DNI</label>
          <div className="mt-2 flex">
            <input id="dni" name="dni" type="number" onChange={e => setDNI(e.target.value)}   required className="block  w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>

          </div>
        </div>  
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
            <div className="text-sm">
            TGROUP;30716526964
            </div>
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
  
    </div>
  </div>

      
    </UpdateTriggerProvider>
  );
}