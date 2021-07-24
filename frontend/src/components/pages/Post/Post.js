import React, { useEffect, useState, useContext } from "react";
import { httpClient } from "../../../utils/HttpClient";
import { AuthContext } from "../../../AuthContext";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Detailbar from "../../fragments/Detailbar/Detailbar";
import { server, GET_POSTBYIDS_TEXTEDITOR_URL } from "../../../Constatns";
import "./Post.css";

function Post() {
  let { id } = useParams();
  const [post, setPost] = useState(null);
  const { forceUpdate } = useContext(AuthContext);
  useEffect(async () => {
    try {
      let result = await httpClient.post(
        `${server.GET_POSTBYID_TEXTEDITOR_URL}/${id}`
      );

      setPost(result.data.result);
    } catch (err) {
      localStorage.clear();
      forceUpdate();
    }
  }, []);

  const post_data = () => {
    if (!post) return;
    // console.log(post)
    return post.map((data) => {
      console.log(data);
      return (
        <div key={id} className="container-fluid">
          <div className="m-3">
            <h3>Title: {data.title}</h3>
          </div>

          <div className="container-fluid " />
          <div className="row">
            <div className="col">
              <div className="container bg-light p-5 " style={{border: "2px solid black" ,borderRadius: "25px"}}>
                <form>
                  <div className="mb-3 text-center">
                    <h3>Detail</h3>
                  </div>
                  <hr />
                  <div className="mb-3 ">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Create Date
                    </label>
                    <input
                      className="form-control"
                      value={data.created_at.split("T")[0]}
                      disabled={true}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Category
                    </label>
                    <br />
                    <input
                      className="form-control"
                      value={data.language}
                      disabled={true}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="col-auto col-lg-8">
              <div
                className="bg-light m-1  min-vh-100 p-3"
                dangerouslySetInnerHTML={{ __html: data.posts }}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container-fluid" style={{}}>
      {post_data()}
    </div>
  );
}

export default Post;
