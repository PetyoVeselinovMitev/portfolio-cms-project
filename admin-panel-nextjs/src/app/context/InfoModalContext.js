import { createContext, useContext, useState } from "react";

const InfoModalContext = createContext();

export const InfoModalProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const showModal = (message, type) => {
    const id = (Date.now() * Math.random());

    setMessages((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 6000);
  };

  const hideModal = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <InfoModalContext.Provider value={{ messages, showModal, hideModal }}>
      {children}
    </InfoModalContext.Provider>
  );
};

export const useInfoModal = () => {
  return useContext(InfoModalContext);
};
