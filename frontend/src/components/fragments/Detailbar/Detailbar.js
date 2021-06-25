import React, { useEffect, useState } from "react";
import { httpClient } from "../../../utils/HttpClient";
import "./Detailbar.css";
import { GET_CATEGORY_URL, server } from "../../../Constatns";

function Detailbar(props) {
  const [categoryData, setCategoryData] = useState([]);
  const [sendCate, setSendCate] = useState("select");
  const [category_id, setCategory_id] = useState(null);

  useEffect(async () => {
    try {
      let result = await httpClient.get(server.GET_CATEGORY_URL);
      if (!result) return;
      console.log(result);
      setCategoryData(result.data.result);
    } catch (err) {
      // localStorage.clear();
      console.log(err);
    }
  }, []);

  const dateNow = () => {
    let date = new Date();
    let dateNow = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return dateNow + "/" + month + "/" + year;
  };

  const onSelect = (event) => {
    const selectedIndex = event.target.options.selectedIndex;
    console.log(selectedIndex);
    return selectedIndex;
  };

  const categoryList = () => {
    return categoryData.map((data) => {
      return (
        <option key={data.id} value={data.laguange}>
          {data.laguange}
        </option>
      );
    });
  };

  return (
    <div className="container-fluid">
      <div className="side-detailbar">
        <div className="header-detailbar">
          <h3>Detail</h3>
        </div>

        <div className="container">
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Create Date
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={dateNow()}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Select Category
              </label>
              <br />
              <select
                className="form-select"
                id="category_list"
                value={sendCate}
                onChange={(e) => {
                  e.preventDefault();
                  setSendCate(e.target.value);
                  let datalist = { category: e.target.value };
                  let category_id = onSelect(e);
                  props.getcategory(category_id);
                }}
              >
                <option value="select">Select</option>
                {categoryList()}
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Detailbar;
