import React, { createContext, useContext, useState, ReactNode } from 'react';

const UpdateTriggerContext = createContext({
  triggerUpdate: false,
  setTriggerUpdate: (value: boolean) => {}
});


export const UpdateTriggerProvider = ({ children }: { children: ReactNode }) => {
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  return (
    <UpdateTriggerContext.Provider value={{ triggerUpdate, setTriggerUpdate }}>
      {children}
    </UpdateTriggerContext.Provider>
  );
};

export const useUpdateTrigger = () => useContext(UpdateTriggerContext);