import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./CreatePost.css";

import {
  LIMIT_UPLOADIMAGES,
  server,
  CREATE_POST_URL,
} from "../../../Constatns";
import jwt_decode from "jwt-decode";
import { httpClient } from "../../../utils/HttpClient";

function CreatePost(props) {
  let history = useHistory();

  const [shopImages, setShopImages] = useState([]);
  const [btnaddPost, setBtnaddPost] = useState(true);
  const [postDetail, setPostDetail] = useState({
    title: null,
    post: null,
  });

  const onImageChange = (e) => {
    if (e.target.files[0] === undefined) return;
    if (e.target.files[0]) {
      return setShopImages([
        ...shopImages,
        {
          file: e.target.files[0],
          file_obj: URL.createObjectURL(e.target.files[0]),
        },
      ]);

      return alert("Please Input");
    }
    return;
  };

  const showPreviewImage = () => {
    if (shopImages) {
      return shopImages.map((data) => (
        <img
          src={data.file_obj}
          key={data.file_obj}
          style={{ height: 100, marginTop: 16, marginRight: 16, width: 120 }}
        />
      ));
    }
  };

  const isValidation = async () => {
    const { title, post } = postDetail;
    

    if (title && post) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("post", post);
      formData.append("created_by", userLogin());

      // ? Loop send Image
      if (shopImages.length !== 0) {
        for (let index = 0; index < shopImages.length; index++) {
          formData.append("post_image_" + index, shopImages[index].file);
        }
      }

      let result = await httpClient.post(server.CREATE_POST_URL, formData);
    }
  };

  const disableBtnAdd = () =>{
    if(postDetail.post && postDetail.title && btnaddPost){
      return false
    }
    return true
  }

  const userLogin = () => {
    try {
      let token = localStorage.getItem("localID");
      if (!token) return;
      let decoded = jwt_decode(token);
      return decoded.email;
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <div className="container-fluid">
      <div>
        <h1 style={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Create Post
        </h1>
        <div className="container-xl container_post">
          <div className="mb-3" style={{ paddingTop: "15px" }}>
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <b>Title Post:</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="title-post"
              placeholder=""
              onChange={(e) => {
                setPostDetail({ ...postDetail, title: e.target.value });
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              <b>Post:</b>
            </label>
            <textarea
              type="text"
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              defaultValue={""}
              onChange={(e) => {
                setPostDetail({ ...postDetail, post: e.target.value });
              }}
            />
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                <b>Upload Image: (Max : 5 Images)</b>
              </label>
              <input
                type="file"
                className="form-control"
                id="post_image"
                placeholder=""
                accept="image/*"
                name="post_image"
                multiple
                disabled={shopImages.length <= 4 ? false : true }
                onChange={(e) => {
                  e.preventDefault();
                    onImageChange(e);
                }}
              />
            </div>
            <div className="container_images">{showPreviewImage()}</div>
            <div className="container-btn-post">
              <div className="btn_addpost">
                <button
                  className="btn btn-success btn-addpost"
                  disabled={disableBtnAdd()}
                  onClick={() => {
                    setTimeout(() => {
                      setBtnaddPost(true)
                      isValidation();
                    }, 1000);
                    setBtnaddPost(false)
                    
                    
                  }}
                >
                  Add Post
                </button>
              </div>
              <div className="btn_cancel">
                <button
                  className="btn btn-warning btn-cancel"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
