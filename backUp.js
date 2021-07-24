
  return (
    <div className="container-fluid">
      <h3 style={{ paddingTop: "15px", paddingBottom: "15px" }}>Edit Post</h3>
      <div className="row m-0">
        {/* Detailbar Left */}
        <div className="col col-auto col-lg-4 p-2">
          <div className="p-5">
            <Detailbar getcategory={setCategory} />
          </div>
        </div>
        {/* Main Create Post */}
        <div className="col col-auto m-0 p-2">
          <div className="container-fluid">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <b>Title Post:</b>
            </label>

            <input
              type="text"
              className="form-control"
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
                height: 500,
                menubar: false,
                statusbar: false,
                object_resizing: "img",
                resize_img_proportional: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help ",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor link image | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                image_title: false,
                automatic_uploads: true,
                images_reuse_filename: true,
                image_dimensions: false,
                // ใส่ชื่อ class ที่ Tag img
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
                    console.log("file" , file);
                    cb(URL.createObjectURL(file), { title: file.name });
                  };

                  input.click();
                },
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />

            <div className="container-btn-post">
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
        </div>

        {/* Sidebar Right */}
        {/* <div className="side">
          <Sidebar />
        </div> */}
      </div>
    </div>
  );
