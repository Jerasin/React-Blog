import React, { useRef, useState , useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { httpClient } from "../../utils/HttpClient";
import { useHistory, useLocation , useParams } from "react-router-dom";
import {
  server,
  CREATE_POST_TEXTEDITOR_URL,
  UPLOADIMAGES_POST_TEXTEDITOR_URL,
} from "../../Constatns";

function EditTextEditor() {
  const editorRef = useRef(null);
  const [showImages, setShowImages] = useState([]);
  const [postDetail, setPostDetail] = useState({
    title: null,
    post: null,
  });
  let dataArrary = [];
  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    try{
      httpClient.get()
    }
    catch(err){
      console.log(err)
    }
  }, [])

  const log = async () => {
    if (editorRef.current) {
      let result = await httpClient.post(server.CREATE_POST_TEXTEDITOR_URL, {
        title: postDetail.title,
        post: editorRef.current.getContent(),
      });
    }
  };


  // ? เอา token
  const getToken = () => {
    try {
      let token = localStorage.getItem("localID");
      return "Bearer" + " " + token;
    } catch (err) {
      localStorage.clear();
    }
  }

  // ? เซต Header ตอนอัพรูป
  const imagesUploadHandler = (blobInfo, success, failure) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:4000/api/post-texteditor/uploadsimages");
    xhr.setRequestHeader("Authorization", getToken()); // manually set header

    xhr.onload = function () {
      if (xhr.status !== 200) {
        failure("HTTP Error: " + xhr.status);
        return;
      }

      let json = JSON.parse(xhr.responseText);

      if (!json || typeof json.location !== "string") {
        failure("Invalid JSON: " + xhr.responseText);
        return;
      }

      success(json.location);
    };

    let formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

  return (
    <div className="container-fluid">
      <h1 style={{ paddingTop: "15px", paddingBottom: "15px" }}>Create Post</h1>
      <div className="container-xl ">
        <div style={{ paddingBottom: "15px" }}>
          {console.log(id)}
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
            // mages_upload_handler: example_image_upload_handler
            // images_upload_url:
            //   "http://localhost:4000/api/post-texteditor/uploadsimages",
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

export default EditTextEditor;
