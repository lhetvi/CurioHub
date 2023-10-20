import React from "react";
import QuoraHeader from "./QuoraHeader";
import { Outlet } from "react-router-dom";

function Quora(props) {
  return (
    <div className="quora">
      <QuoraHeader {...props} />
      <Outlet />
    </div>
  );
}

export default Quora;
