import React , { useEffect} from "react";
import {httpClient} from '../../../utils/HttpClient'
import "./Sidebar.css";


// useEffect(asyn () => {
//   let result = await  httpClient.get()
// }, [])

function Sidebar() {
  return (
    <div className="container side-bar">
      <div className="header-sidebar">
        <h3>New 5 Post</h3>
      </div>

      <div className="post-sidebar-body">
        <div className="card" style={{ width: "18rem" }}>
          <img src="..." className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="btn btn-primary">
              Go somewhere
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
