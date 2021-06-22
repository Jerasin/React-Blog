import React, { useRef, useState, useEffect, useContext } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { AuthContext } from "../../AuthContext";
import { httpClient } from "../../utils/HttpClient";
import Sidebar from "../fragments/Sidebar/Sidebar";
import Detailbar from "../fragments/Detailbar/Detailbar";
import "./TextEditor.css";
import jwt_decode from "jwt-decode";
import { useHistory, useLocation } from "react-router-dom";
import {
  server,
  CREATE_POST_TEXTEDITOR_URL,
  UPLOADIMAGES_POST_TEXTEDITOR_URL,
} from "../../Constatns";

function TextEditor(props) {
  const editorRef = useRef(null);
  let token;
  let history = useHistory();
  const [showImages, setShowImages] = useState([]);
  const [postDetail, setPostDetail] = useState({
    title: null,
    post: null,
    category: "Select",
  });
  const { forceUpdate } = useContext(AuthContext);
  const [uploadImg, setUploadImg] = useState(false)

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
    xhr.open("POST", "http://localhost:4000/api/post-texteditor/uploadsimages");
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
 console.log(blobInfo.filename())
    let formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

  const log = async () => {
    if (editorRef.current) {
      let data =  { ...postDetail,
        title: postDetail.title,
        post: editorRef.current.getContent(),
        user_created: getShortId(),
      }
      setUploadImg(true)
      let result = await httpClient.post(server.CREATE_POST_TEXTEDITOR_URL,data);
      if(result.data.status === 200) {
        forceUpdate();
        return history.push('/main')
      }
      alert(result.data.status);
    }
  };

  const setCategory = (categoryId) => {
    setPostDetail({ ...postDetail , category: categoryId });
  };

  return (
    <div className="container-fluid">
      <h3 style={{ paddingTop: "15px", paddingBottom: "15px" }}>Create Post</h3>

      <div className="gird-container">
        {/* Detailbar Left */}
        <div className="side">
          <Detailbar getcategory={setCategory} />
        </div>

        {/* Main Create Post */}
        <div className="container-xl container-texteditor">
          <div className="" style={{ paddingBottom: "15px" }}>
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
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor link image | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              image_title: false,
              automatic_uploads: true,
              images_reuse_filename: true,

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
                  cb(URL.createObjectURL(file), { title: file.name });
                };

                input.click();
              },
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          <div className="container-btn-post">
            {console.log(uploadImg)}
            <div className="btn_addpost">
              <button
                className="btn btn-primary"
                onClick={log}
                style={{ marginBottom: "5px" }}
              >
                Add Post
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  // history.goBack()
                  history.goBack();
                }}
                style={{ marginBottom: "30px" }}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Right */}
        <div className="side">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
