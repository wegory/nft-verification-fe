import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import Router from "./router";
import { ToastProvider } from "react-toast-notifications";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider autoDismiss autoDismissTimeout={10000} placement="top-right">
        <Router />
      </ToastProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
