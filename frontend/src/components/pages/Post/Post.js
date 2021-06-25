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
      let result = await httpClient.get(
        `${server.GET_POSTBYIDS_TEXTEDITOR_URL}/${id}`
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
      // console.log(data);
      return (
        <div key={id} className="container-fluid container-header">
          <div className="title">
            <h3>Title: {data.title}</h3>
          </div>
{console.log(data)}
          <div className="post-grid">
            <div className="container-fluid">
              <div className="container_sidebar">
              <div className="menubar">
                <div>
                <h3>Status</h3>
                </div>
                <h3 >Create by</h3>
                <p>{data.email}</p>
              </div>
              </div>
            </div>
            <div className="container-fluid main_content">
              
            <div className="container-xl container-texteditor-post">
              <div className="" style={{ paddingBottom: "15px" }}>
                <div
                  className="post_data"
                  dangerouslySetInnerHTML={{ __html: JSON.parse(data.posts) }}
                />
              </div>
            </div>
         
            </div>
          </div>
        </div>
      );
    });
  };

  return <div className="gird-container-post">{post_data()}</div>;
}

export default Post;
