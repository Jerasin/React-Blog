import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../../../AuthContext";
import { useParams, useHistory } from "react-router-dom";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";

function UserPost() {
  let { id } = useParams();
  let history = useHistory();
  const [post, setPost] = useState(null);
  const [togger, setTogger] = useState(false);
  const { forceUpdate } = useContext(AuthContext);

  useEffect(async () => {
    const result = await httpClient.post(
      `${server.GET_POSTBYEMAIL_TEXTEDITOR_URL}/${id}`
    );
    forceUpdate();
    if (result.data.status === 200) {
      setPost(result.data.result);
      setTogger(false);
    } else {
      setTogger(false);
      localStorage.clear();
    }
  }, [togger]);

  const postItem = () => {
    if (post === null) return;
    console.log(post);
    return post.map((data) => (
      <div
        className="col col-auto  mb-3"
        key={data.id}
        style={{ width: "18rem" }}
      >
        <div className="card">
          {/* <img src="..." className="card-img-top" alt="..." /> */}
          <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text">Category: {data.laguange}</p>
            <p className="card-text">Post by: {data.email}</p>
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    history.push(`/edit-text-editor/${data.id}`);
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => {
                    httpClient.delete(
                      `${server.DELETE_POSTBYID_TEXTEDITOR_URL}/${data.id}`
                    );
                    setTogger(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid p-5">
      <h4>User : {id}</h4>
      <hr />
      <div className="row  justify-content-start">{postItem()}</div>
    </div>
  );
}

export default UserPost;
