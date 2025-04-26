import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import { ActiveTabProvider } from "./context/ActiveTabContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ActiveTabProvider>
      <App />
    </ActiveTabProvider>
  </React.StrictMode>
);
