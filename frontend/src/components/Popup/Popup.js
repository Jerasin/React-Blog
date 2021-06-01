import React, { useEffect } from "react";
import "./Popup.css";
function Popup(props) {
  useEffect(() => {
    console.log("Popup start");
    document.documentElement.style.overflowY = "hidden";
    return () => {
      console.log("Popup end");
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  return (
    <div className="popup-box">
      <div className="box">
        <div className="box-content">
          <h1 style={{color: "red"}}>{props.content}</h1>
        </div>
        <div className="box-body">
          <p>Please Check {props.content}</p>
        </div>
        <div>
          <button className="btn btn-primary btn_close" onClick={props.onPopupClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
