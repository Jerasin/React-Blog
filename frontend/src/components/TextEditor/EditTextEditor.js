import React, { useRef, useState, useEffect, useContext } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { AuthContext } from "../../AuthContext";
import { httpClient } from "../../utils/HttpClient";
import Sidebar from "../fragments/Sidebar/Sidebar";
import Detailbar from "../fragments/Detailbar/Detailbar";
import "./TextEditor.css";
import jwt_decode from "jwt-decode";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  server,
  apiUrl,
  CREATE_POST_TEXTEDITOR_URL,
  UPLOADIMAGES_POST_TEXTEDITOR_URL,
} from "../../Constatns";

function TextEditor(props) {
  const editorRef = useRef(null);
  let token;
  let history = useHistory();
  const [showImages, setShowImages] = useState([]);
  const [editPost, setEditPost] = useState({
    id: "",
    title: ``,
    post: ``,
    category: "",
    initialPost: "",
  });

  const { forceUpdate } = useContext(AuthContext);
  const [uploadImg, setUploadImg] = useState(false);
  let { id } = useParams();

  useEffect(async () => {
    const result = await httpClient.post(
      `${server.GET_POSTBYID_TEXTEDITOR_URL}/${id}`
    );
    if (result.data.status === 200) {
      result.data.result.map((data) => {
        console.log(data);
        setEditPost({
          id: data.post_id,
          title: data.title,
          post: data.posts,
          category: data.category_id,
          initialPost: data.posts,
        });
      });
    } else {
      localStorage.clear();
    }
  }, []);

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

  const getToken = () => {
    try {
      let token = localStorage.getItem("localID");
      return "Bearer" + " " + token;
    } catch (err) {
      localStorage.clear();
    }
  };

  // ? เซต Header ตอนอัพรูป
  const imagesUploadHandler = (blobInfo, success, failure) => {
    // ? XMLHttpRequest (XHR) เป็น Api ที่สามารถเรียกใช้ได้จาก จาวาสคริปต์ เจสคริปต์ วีบีสคริปต์ และภาษาสคริปต์อื่นๆ ในการแลกเปลี่ยน และปรับรูปแบบ XML จากเว็บเซิร์ฟเวอร์ โดยใช้ HTTP ซึ่งสร้างการเชื่อมต่อระหว่างเว็บเบราว์เซอร์ (Client-Side) กับ เว็บเซิร์ฟเวอร์ (Server-Side)

    let xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl + server.UPLOADIMAGES_POST_TEXTEDITOR_URL);
    xhr.setRequestHeader("Authorization", getToken()); // manually set header

    xhr.onload = function () {
      if (xhr.status !== 200) {
        failure("HTTP Error: " + xhr.status);
        localStorage.clear();
        forceUpdate();
        return;
      }

      let json = JSON.parse(xhr.responseText);

      // ? ถ้า token expired
      if (!json || typeof json.location !== "string") {
        failure("Invalid JSON: " + xhr.responseText);
        localStorage.clear();
        forceUpdate();
        return;
      }

      success(json.location);
    };

    let formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

  const log = async () => {
    if (editPost.category === "Select") return alert("Please Select Category");
    if (editorRef.current) {
      let data = {
        ...editPost,
        title: editPost.title,
        post: editorRef.current.getContent(),
        user_created: getShortId(),
      };
      console.log(data);

      try {
        let result = await httpClient.put(
          `${server.UPDATE_POSTBYID_TEXTEDITOR_URL}/${id}`,
          data
        );
        if (result.data.status === 200) {
          forceUpdate();
          return history.push("/main");
        }
        alert(result.data);
      } catch (err) {
        // localStorage.clear();
        // forceUpdate();
      }
    }
  };

  const setCategory = (categoryId) => {
    setEditPost({ ...editPost, category: categoryId });
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col col-auto col-md-4 mb-3">
          <Detailbar getcategory={setCategory} />
        </div>
        <div className="col p-0 m-0 col-auto col-md-8">
          <div className="container-fluid">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <b>Title Post:</b>
            </label>
            {console.log(editPost.title)}
            <input
              type="text"
              className="form-control mb-3"
              id="title-post"
              placeholder=""
              value={editPost.title}
              onChange={(e) => {
                setEditPost({ ...editPost, title: e.target.value });
              }}
            />

            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={editPost.post}
              init={{
                min_height: 500,
                menubar: false,
                statusbar: false,
                object_resizing: "img",
                resize_img_proportional: true,
                emoticons_database: "emojis",
                plugins: [
                  "autoresize advlist autolink emoticons lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help ",
                ],
                toolbar:
                  "undo redo  | formatselect | " +
                  "bold italic backcolor link image emoticons  | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                image_title: false,
                automatic_uploads: true,
                images_reuse_filename: true,
                image_dimensions: false,
                // ? ใส่ชื่อ class ที่ Tag img
                image_class_list: [
                  { title: "Responsive", value: "img-fluid p-3" },
                ],

                // ? ส่งรูปไปยัง server แบบไม่มี token
                // images_upload_url:
                //   "http://localhost:4000/api/post-texteditor/uploadsimages",

                // ? ส่งรูปไปยัง server แบบมี token
                images_upload_handler: imagesUploadHandler,

                file_picker_types: "image",
                file_picker_callback: function (cb, value, meta) {
                  let input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function (dialogApi, details) {
                    let file = this.files[0];
                    console.log(file);
                    if (file != null) {
                      cb(URL.createObjectURL(file), { title: file.name });
                    }
                  };

                  input.click();
                },
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />

            <div className="row p-0 m-0 mt-3 justify-content-end">
              <div className="row p-0 m-0 ">
                <div className="col p-0">
                  <div className="col col-auto  col-lg-2  p-0">
                    <button
                      className="btn btn-primary"
                      onClick={log}
                      style={{ marginBottom: "5px" }}
                    >
                      Edit
                    </button>
                    {console.log(editPost.post)}
                  </div>
                  <div className="col col-auto  col-lg-2 p-0">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        // history.goBack()
                        forceUpdate();
                        history.push("/main");
                      }}
                      style={{ marginBottom: "30px" }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
