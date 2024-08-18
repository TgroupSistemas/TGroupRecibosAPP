import React, { useState, useEffect } from 'react';
import { eliminarProducto } from "../app/utils";
import { useUpdateTrigger } from "../app/context";
import PDFViewer from "@/components/PDFViewer";



export default function Firma() {
  return (
<div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      
    >      <div className="bg-white p-8 rounded-lg shadow w-3/6  mt-10 ">
        <h2 className="text-xl font-bold mb-4 text-black">Vacaciones - 07/04/24 - Firma en conformidad</h2>
        <div className=" justify-center">
          <h3 className='font-bold mb-4 text-gray-600'>Enviamos un codigo de verificacion a tu mail (m*****3@gmail.com) </h3>
        <label className="block text-sm font-medium text-gray-700">Código de verificación</label>
        <input
          type="text"
          id="verificationCode"
          value=""
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
        />
        <span className='mb-4'>¿No te llegó el correo?   <a className='text-blue-600'> Reenviar</a> en 00:32</span> 

        <button
            className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-red-700 transition-all mt-4"
            
          >
            Enviar
          </button>
        </div>
        <p className="mb-4"></p>
        
      </div>
    </div>
  );
}