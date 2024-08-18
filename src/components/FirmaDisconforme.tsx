import React, { useState, useEffect } from 'react';
import { eliminarProducto } from "../app/utils";
import { useUpdateTrigger } from "../app/context";
import PDFViewer from "@/components/PDFViewer";



export default function FirmaDisconforme() {
  return (
<div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      
    >      <div className="bg-white p-8 rounded-lg shadow w-3/6  mt-10 ">
        <h2 className="text-xl font-bold mb-4 text-black">Vacaciones - 07/04/24</h2>
        <div className=" justify-center">
          <h3 className='font-bold mb-4 text-gray-600'>Indicanos el motivo de tu disconformidad</h3>
        <label className="block text-sm font-medium text-gray-700">Motivos</label>
        <select
        id="verificationCode"
      
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2"
      >
        <option value="" disabled>Elegí una opción</option>
        <option value="incorrect_amount">Monto incorrecto</option>
<option value="missing_bonus">Bono faltante</option>
<option value="incorrect_deductions">Deducciones incorrectas</option>
<option value="incorrect_hours">Horas incorrectas</option>
<option value="other">Otro</option>
      </select>

        <button
            className="px-4 py-2 mr-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition-all mt-4"
            
          >
            Siguiente
          </button>
        </div>
        <p className="mb-4"></p>
        
      </div>
    </div>
  );
}