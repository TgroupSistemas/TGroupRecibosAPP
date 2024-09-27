import React, { useState, useEffect } from "react";

import { useAppContext } from "@/contexts/AppContext";
interface mailProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ChangePassword(props: mailProps) {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePassword, ponerMail, correoLoading } = useAppContext();




  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(password, confirmPassword);
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else if (password === "" || confirmPassword === "") {
      setError("Las contraseñas no pueden ser vacías");
    } else {
      const response = await changePassword({
        password,
        confirmPassword,
      });
      props.setPopUpOpen(false);
      
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      onClick={() => props.setPopUpOpen(false)}

    >
      {" "}
      <div className="bg-white p-8 rounded-lg shadow w-4/5 md:w-3/6 mt-10 " onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-black">Nueva Contraseña</h2>
        <div className=" justify-center">

          <h3 className="font-bold  text-gray-600 mb-2">Creá una nueva contraseña para tu cuenta.</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Contraseña
              </label>
              <input
                required
                type="password"
                id="contra1"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
              />

              <label className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                required
                type="password"
                id="contra2"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
              />
              <p className="text-red-500 text-sm mt-2">{error}</p>

              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-4"
                onClick={handleSubmit}
              >
                Confirmar
              </button>
            </div>
          
        </div>
        <p className="mb-4"></p>
      </div>
    </div>
  );
}
