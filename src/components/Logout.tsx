import React, { useState, useEffect } from "react";
import { useUpdateTrigger } from "../app/context";
import { useAppContext } from "@/contexts/AppContext";

interface logoutProps {
  setPopUpLogoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Firma(props: logoutProps) {
  const { updateReciboFirmado, recibosFirmaLoading, logout} = useAppContext();

  const closePopup = () => {
    props.setPopUpLogoutOpen(false); // or any other value that indicates the popup should be closed
  };
  const handleClick = () => {
    logout();
    closePopup();
  };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      onClick={closePopup}
    >
      {" "}
      <div
        className="bg-white p-8 rounded-lg shadow px-10 mx-4 mt-10 "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-black text-center">¿Estás seguro de que deseas cerrar sesión?</h2>
        <div className="flex justify-center">
          <button
            className="bg-red-500 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleClick}
          >
            Sí
          </button>
          <button
            className="bg-gray-500 w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={closePopup}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
