import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import { useParams, useHistory } from "react-router-dom";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import jwt_decode from "jwt-decode";

function EditCategory() {
  const { id } = useParams();
  const history = useHistory();
  const [updateCategory, setUpdateCategory] = useState({
    language: "",
    created_by: "",
    created_at: "",
    updated_by: "",
    updated_at: "",
    forceUpdate_by: "",
  });

  const { forceUpdate } = useContext(AuthContext);

  useEffect(async () => {
    try {
      const result = await httpClient.post(
        `${server.GET_CATEGORYBYID_URL}/${id}`
      );
      // console.log(result.data.result[0]);
      setUpdateCategory({
        language: result.data.result[0].language,
        created_at: result.data.result[0].created_at,
        created_by: result.data.result[0].email,
        updated_by: result.data.result[0].updated_by
          ? result.data.result[0].updated_by
          : "",
        updated_at: result.data.result[0].updated_at
          ? result.data.result[0].updated_at
          : "",
      });
    } catch (err) {
      localStorage.clear();
    }
  }, []);

  const checkAuthen = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded.short_id;
    } catch (err) {
      localStorage.clear();
    }
  };

  const handleChange = async (e) => {
    await setUpdateCategory({
      ...updateCategory,
      language: e.target.value,
      forceUpdate_by: checkAuthen(),
    });
  };

  const submitEdit = async () => {
    const result = await httpClient.put(
      `${server.UPDATE_CATEGORY_URL}/${id}`,
      updateCategory
    );
    forceUpdate();
    history.push("/setting");
  };

  return (
    <div className="container-fluid">
      <div className="container mt-3 ">
        <h3>Edit Category: {id}</h3>
        <hr />
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Language
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={updateCategory.language}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Created By:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={updateCategory.created_by}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Created At:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={updateCategory.created_at.split("T")[0]}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Updated By:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={updateCategory.updated_by}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Updated At:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={
                    updateCategory.updated_at
                      ? updateCategory.updated_at.split("T")[0]
                      : ""
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary me-3"
                onClick={(e) => {
                  e.preventDefault();
                  submitEdit();
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  forceUpdate();
                  history.push(`/setting`);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCategory;
