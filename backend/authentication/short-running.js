// ? Create Short ID


// ? Default Short ID
let shortID = 3;
let shortPostID = 1;

const autoGen_shortID = () => {
  let str = "" + shortID;
  let pad = "000000";
  let shortID_NOW = pad.substring(0, pad.length - str.length) + str;
  console.log(typeof(shortID_NOW))
  return shortID_NOW;
};

const add_shortID = () => {
  shortID = shortID + 1;
}

const autoGen_postID = () => {
  let str = "" + shortPostID;
  let pad = "00000";
  let postID_NOW = pad.substring(0, pad.length - str.length) + str;
  return postID_NOW;
};

const add_postID = () => {
  shortPostID = shortPostID + 1;
}

module.exports =  {
  autoGen_shortID,
  add_shortID,
  add_postID,
  autoGen_postID 
}
