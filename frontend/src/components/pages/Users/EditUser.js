import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import { useParams, useHistory } from "react-router-dom";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import jwt_decode from "jwt-decode";

function EditUser() {
  const { id } = useParams();
  const history = useHistory();
  const [updateUser, setUpdateuser] = useState({
    email: "",
    role: "",
    created_at: "",
    updated_by: "",
    updated_at: "",
  });
  const [roleLists, setRoleLists] = useState([]);

  const { forceUpdate } = useContext(AuthContext);

  useEffect(async () => {
    try {
      const result = await httpClient.post(`${server.GET_USERSBYID_URL}/${id}`);
      const role = await httpClient.get(`${server.GET_ROLEALL_URL}`);
      console.log(result.data.result[0]);
      //   console.log(role.data.result);
      setRoleLists(role.data.result);
      setUpdateuser({
        email: result.data.result[0].email,
        role: result.data.result[0].role_name,
        created_at: result.data.result[0].created_at,
        updated_by: result.data.result[0].updated_by
          ? result.data.result[0].updated_by
          : "",
        updated_at: result.data.result[0].updated_at
          ? result.data.result[0].updated_by
          : "",
        role_id: "",
        forceUpdate_by: "",
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

  const roleList = () => {
    //   console.log(roleLists)
    return roleLists.map((data) => {
      console.log(data);
      return (
        <option key={data.id} value={data.role_name}>
          {data.role_name}
        </option>
      );
    });
  };

  const onSelect = (event) => {
    const selectedIndex = event.target.options.selectedIndex;
    // console.log(selectedIndex);
    return selectedIndex;
  };

  const submitEdit = async () => {
    const result = await httpClient.put(
      `${server.UPDATE_USER_URL}/${id}`,
      updateUser
    );
    forceUpdate();
    history.push("/users");
  };

  return (
    <div className="container-fluid">
      <div className="container mt-3 ">
        <h3>Edit User: {id}</h3>
        <hr />
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={updateUser.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Role:
                </label>
                <select
                  className="form-select"
                  value={updateUser.role}
                  onChange={(e) => {
                    e.preventDefault();

                    let role_id = onSelect(e);
                    setUpdateuser({
                      ...updateUser,
                      role: e.target.value,
                      role_id: role_id,
                      forceUpdate_by: checkAuthen(),
                    });
                  }}
                >
                  <option value="select">Select</option>
                  {roleList()}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Created At:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={updateUser.created_at.split("T")[0]}
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
                  value={updateUser.updated_by}
                />
              </div>
              {console.log(updateUser.updated_by)}
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Updated At:
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={updateUser.updated_at.split("T")[0]}
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
                  history.push(`/users`);
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

export default EditUser;
