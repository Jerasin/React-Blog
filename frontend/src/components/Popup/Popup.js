import React, { useEffect } from "react";
import "./Popup.css";
function Popup(props) {
  useEffect(() => {
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  return (
    <div className="popup-box">
      <div className="box">
        <div className="box-content">
          <h5>
            {props.icon}
            {props.content}
          </h5>
        </div>
        <div className="box-body">
          <p>Please Check {props.content}</p>
        </div>
        <div className="container-btn">
          <button
            className="btn btn-primary btn_close"
            onClick={props.onPopupClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
