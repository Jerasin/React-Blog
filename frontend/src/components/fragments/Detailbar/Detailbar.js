import React, { useEffect, useState, componentDidMount } from "react";
import { httpClient } from "../../../utils/HttpClient";
import "./Detailbar.css";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { GET_CATEGORY_URL, server } from "../../../Constatns";

function Detailbar({ getcategory }) {
  const [categoryData, setCategoryData] = useState([]);
  const [sendCate, setSendCate] = useState("select");
  const [category_id, setCategory_id] = useState(null);
  let { id } = useParams();

  useEffect(async () => {
    try {
      const result = await httpClient.get(server.GET_CATEGORY_URL);
      const cartegory = await httpClient.post(
        `${server.GET_POSTBYID_TEXTEDITOR_URL}/${id}`
      );
      if (cartegory) {
        await fetchCartegory(cartegory.data.result);
      }

      if (!result) return;
      setCategoryData(result.data.result);
      // console.log(categoryData);
    } catch (err) {
      localStorage.clear();
      // console.log(err);
    }
  }, []);

  const fetchCartegory = (data) => {
    data.map((data) => {
      console.log("cartegory", data);
      setSendCate(data.laguange);
    });
  };

  const dateNow = () => {
    let date = new Date();
    let dateNow = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return dateNow + "/" + month + "/" + year;
  };

  const onSelect = (event) => {
    const selectedIndex = event.target.options.selectedIndex;
    // console.log(selectedIndex);
    return selectedIndex;
  };

  const categoryList = () => {
    return categoryData.map((data) => {
      console.log(data.laguage)
      return (
        <option key={data.id} value={data.language}>
          {data.language}
        </option>
      );
    });
  };

  return (
    <div className="container-fluid p-0 ps-5 pe-5 w-100">
      <div className="border border-3 border-dark bg-light ">
        <div className="text-center border-bottom border-3 border-dark">
          <h3>Detail</h3>
          
        </div>

        <div className="container">

          <form>
            <div className="mb-3 ">
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
                required
                value={sendCate}
                onChange={(e) => {
                  e.preventDefault();
                  setSendCate(e.target.value);
                  let datalist = { category: e.target.value };
                  let category_id = onSelect(e);
                  console.log(category_id);
                  getcategory(category_id);
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
