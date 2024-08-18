import React, { useState, useEffect } from 'react';
import { eliminarProducto } from "../app/utils";
import { useUpdateTrigger } from "../app/context";
import PDFViewer from "@/components/PDFViewer";
import Firma from './Firma';
import FirmaDisconforme from './FirmaDisconforme';


export default function PopUpDoc() {
  return (
<div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      
    >      <div className="bg-white p-8 rounded-lg shadow w-3/6 h-5/6 mt-10">
        <h2 className="text-xl font-bold mb-4">Vacaciones - 07/04/24</h2>
        <div className="flex justify-center">
        <button
            className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-red-700 transition-all"
            
          >
            Firmar
          </button>
          <button
            className="px-4 py-2 mr-2 w-full bg-rojo text-white rounded hover:bg-red-700 transition-all"
            
          >
            Firmar en disconformidad
          </button>
          <button
            className="px-4 py-2 w-full bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all"
           
          >
            Cerrar
          </button>
        </div>
        <p className="mb-4"></p>
        <PDFViewer></PDFViewer>
        <Firma></Firma>
      </div>
    </div>
  );
}