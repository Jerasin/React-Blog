import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { httpClient } from "../../utils/HttpClient";
import jwt_decode from "jwt-decode";
import {
  server,
  CREATE_POST_TEXTEDITOR_URL,
  UPLOADIMAGES_POST_TEXTEDITOR_URL,
} from "../../Constatns";

function TextEditor() {
  const editorRef = useRef(null);
  const [showImages, setShowImages] = useState([]);
  const [postDetail, setPostDetail] = useState({
    title: null,
    post: null,
  });

  const checkLogin = () => {
    try {
      let token = localStorage.getItem("localID");
      let decoded = jwt_decode(token);
      let short_id = decoded.short_id
      return short_id;
    } catch (err) {
      localStorage.clear();
    }
  }

  let dataArrary = [];

  const log = async () => {
    if (editorRef.current) {
      let result = await httpClient.post(server.CREATE_POST_TEXTEDITOR_URL, {
        title: postDetail.title,
        post: editorRef.current.getContent(),
        user_created: checkLogin(),
      });
      console.log(editorRef.current.getContent())
    }
  };

  return (
    <div className="container-fluid">
      <h1 style={{ paddingTop: "15px", paddingBottom: "15px" }}>Create Post</h1>
      <div className="container-xl ">
        <div style={{ paddingBottom: "15px" }}>
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
            images_upload_url:
              "http://localhost:4000/api/post-texteditor/uploadsimages",
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
        <button
          className="btn btn-primary"
          onClick={log}
          style={{ marginBottom: "80px" }}
        >
          Log editor content
        </button>
      </div>
    </div>
  );
}

export default TextEditor;
