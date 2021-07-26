import React, { useEffect, useState, useContext } from "react";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import jwt_decode from "jwt-decode";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";

function Users(props) {
  const [usersList, setUsersList] = useState([]);
  const [createCategory, setCreateCategory] = useState({
    language: "",
    created_by: "",
  });
  const [reload, setReload] = useState(false);
  const { forceUpdate } = useContext(AuthContext);
  const [pageUser, setPageUser] = useState(1);
  const [limitUser, setLimitUser] = useState(5);
  const [currentPage, setCurrentPage] = useState(null);
  const [userSearch, setUserSearch] = useState(null);
  const [createRole, setCreateRole] = useState({
    role: null,
    created_by: null,
  });
  const [searchUsers, setSearchUsers] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    const result = await httpClient.post(server.GET_USERSBYLIMIT_URL, {
      pageUser,
      limitUser,
    });

    if (searchUsers) {
      setUsersList(searchUsers.result);
      setCurrentPage(searchUsers);
      setReload(false);
      forceUpdate();
      return;
    }

    setUsersList(result.data.result);
    setCurrentPage(result.data);
    setReload(false);
    forceUpdate();
  }, [pageUser, reload]);

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

  const pagination = () => {
    if (!currentPage) return;
    // console.log(currentPage);

    return (
      <ul className="pagination">
        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={() => {
                setPageUser(pageUser - 1);
              }}
            >
              <span aria-hidden="true">«</span>
            </button>
          </li>
        )}

        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPageUser(pageUser - 1);
              }}
            >
              {currentPage.after}
            </button>
          </li>
        )}

        <li className="page-item">
          <button className="btn btn-primary" disabled={true}>
            {currentPage.now}
          </button>
        </li>

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPageUser(pageUser + 1);
              }}
            >
              {currentPage.next}
            </button>
          </li>
        )}

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="page-link"
              aria-label="Next"
              onClick={() => {
                setPageUser(pageUser + 1);
              }}
            >
              <span aria-hidden="true">»</span>
            </button>
          </li>
        )}
      </ul>
    );
  };

  const getShortId = () => {
    try {
      let token = localStorage.getItem("localID");
      let decoded = jwt_decode(token);
      let short_id = decoded.short_id;
      return short_id;
    } catch (err) {
      localStorage.clear();
    }
  };

  const users = () => {
    return usersList.map((data) => {
      // console.log("usersList",data);
      return (
        <tr key={data.id}>
          <th scope="row">{data.id}</th>
          <td>{data.email}</td>
          <td> {data.created_at.split("T")[0]} </td>
          <td>{data.role_name}</td>
          <td>
            <p className="me-4 ms-4">
              <button
                className="btn btn-primary  w-100"
                onClick={() => {
                  history.push(`edit-user/${data.id}`);
                }}
              >
                Edit
              </button>
            </p>
            <p
              className="me-4 ms-4"
              onClick={() => {
                httpClient.delete(`${server.DELETE_USER_URL}/${data.id}`);
                setReload(true);
              }}
            >
              <button className="btn btn-danger w-100">Delete</button>
            </p>
          </td>
        </tr>
      );
    });
  };

  const handleSearch = async () => {
    try {
      const result = await httpClient.post(server.SERACH_USER_URL, {
        userSearch,
        pageUser,
        limitUser,
      });
      // console.log(result.data);
      setSearchUsers(result.data);
      setReload(true);
    } catch (err) {
      localStorage.clear();
    }
  };

  const handleCreateRole = async () => {
    if (createRole === null) return alert("Please Select");
    const result = await httpClient.post(server.CREATED_ROLE_URL, createRole);
    if (result.data.status === 404) return alert("Duplicate Role");
  };

  return (
    <div className="container-fluid p-0 p-lg-5">
      <h1>Users</h1>
      <hr />
      <div className="row p-0 m-0 justify-content-center">
        <div className="col col-auto col-lg-4 mb-3">
          <div className="container bg-light">
            <label className="mb-3 fs-4">Search User</label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                setUserSearch(e.target.value);
              }}
            />
            <button
              className="btn btn-primary mt-3 mb-3"
              onClick={() => {
                handleSearch();
              }}
            >
              Serach
            </button>
          </div>

          <div className="container bg-light mt-3">
            <label className="mb-3 fs-4">Create Role</label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                setCreateRole({
                  role: e.target.value,
                  created_by: checkAuthen(),
                });
              }}
            />
            <button
              className="btn btn-primary mt-3 mb-3"
              type="submit"
              onClick={() => {
                handleCreateRole();
                setReload(true);
              }}
            >
              Create
            </button>
          </div>
        </div>

        <div className="col col-auto col-lg-8 ">
          <div className="container bg-light border border-2 border-black">
            <h4 className="mt-2">Category List</h4>
            <hr />
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Email</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>{users()}</tbody>
              </table>

              <div className="container mt-3">
                <nav aria-label="Page navigation example">{pagination()}</nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
