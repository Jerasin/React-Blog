export const apiUrl = "http://127.0.0.1:4000/api";
export const imageUrl = "http://127.0.0.1:4000";

export const server = {
  REGISTER_URL: "/authen/register",
  REGISTER_FB_URL: "/authen/register_fb",
  LOGIN_URL: "/authen/login",
  FB_LOGIN: "/facebook/authen/facebook",
  GOOGLE_LOGIN: "/google/authen/google",
  CREATE_POST_URL: "/post/create-post",
  CREATE_POST_TEXTEDITOR_URL: "/post-texteditor/post",
  GET_POST_TEXTEDITOR_URL: "/post-texteditor/posts",
  GET_POSTBYEMAIL_TEXTEDITOR_URL: "/post-texteditor/post-email",
  GET_POSTBYID_TEXTEDITOR_URL: "/post-texteditor/post-id",
  GET_POSTBYKEYWORD_TEXTEDITOR_URL: "/post-texteditor/post-serach",
  UPLOADIMAGES_POST_TEXTEDITOR_URL: "/post-texteditor/uploadsimages",
  GET_CATEGORYBYLIMIT_URL: "/category/categories",
  GET_CATEGORY_URL: "/category",
  GET_CATEGORYBYID_URL: "/category",
  CREATED_CATEGORY_URL: "/category",
  UPDATE_CATEGORY_URL: "/category",
  DELETE_CATEGORY_URL: "/category",
  UPDATE_POSTBYID_TEXTEDITOR_URL: "/post-texteditor/post",
  DELETE_POSTBYID_TEXTEDITOR_URL: "/post-texteditor/post",
  GET_USERSBYLIMIT_URL: "/authen/users",
  GET_USERSBYID_URL: "/authen/user",
  UPDATE_USER_URL: "/authen/user",
  SERACH_USER_URL: "/authen/user-serach",
  DELETE_USER_URL: "/authen/user",
  GET_ROLEALL_URL: "/authen/roles",
  CREATED_ROLE_URL: "/authen/user-role",
  TEST_API_URL: "/post/create-post-test",
};

export const LIMIT_UPLOADIMAGES = 5;

export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";
export const NETWORK_CONNECTION_MESSAGE = "NETWORK_CONNECTION_MESSAGE";
