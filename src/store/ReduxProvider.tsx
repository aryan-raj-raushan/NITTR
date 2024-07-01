'use client'
import { Provider } from "react-redux";
import { store } from "./index";
import { persistStore } from "redux-persist";
import { useEffect } from "react";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const persistor:any = persistStore(store);
    return () => persistor.flush();
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
