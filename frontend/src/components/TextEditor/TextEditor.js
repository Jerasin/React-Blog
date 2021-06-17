import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { httpClient } from "../../utils/HttpClient";
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
  let dataArrary = [];

  const log = async () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
      // let post = editorRef.current.getContent();
      // await setPostDetail({ ...postDetail, post: post });
      // console.log(postDetail)
      // if(postDetail.post === null) return
      let result = await httpClient.post(server.CREATE_POST_TEXTEDITOR_URL, {title: postDetail.title ,post:editorRef.current.getContent() });
    }
  };

  const onImageChange = (file) => {
    setShowImages([
      ...showImages,
      {
        file: file,
        file_obj: URL.createObjectURL(file),
      },
    ]);
  };

  // const isValidation = async () => {
  //   const { title, post } = postDetail;

  //   if (title && post) {
  //     const formData = new FormData();
  //     formData.append("title", title);
  //     formData.append("post", post);
  //     formData.append("created_by", userLogin());

  //     // ? Loop send Image
  //     if (showImages.length !== 0) {
  //       for (let index = 0; index < showImages.length; index++) {
  //         formData.append("post_image_" + index, showImages[index].file);
  //       }
  //     }

  //     let result = await httpClient.post(server.CREATE_POST_URL, formData);
  //   }
  // };

  return (
    <div className="container-fluid">
      <h1 style={{ paddingTop: "15px", paddingBottom: "15px" }}>Create Post</h1>
      <div className="container-xl ">
        <div style={{ paddingBottom: "15px" }}>
          <label htmlFor="exampleFormControlInput1" className="form-label">
            <b>Title Post:</b>
            {/* {console.log(postDetail)} */}
            {console.log(showImages)}
            {console.log(dataArrary)}
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
