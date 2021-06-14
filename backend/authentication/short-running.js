// ? Create Short ID


// ? Default Short ID
let shortID = 1;
let shortPostID = 1;

const autoGen_shortID = () => {
  let str = "" + shortID;
  let pad = "000000";
  let shortID_NOW = pad.substring(0, pad.length - str.length) + str;
  shortID = shortID + 1;
  return shortID_NOW;
};

const autoGen_postID = () => {
  let str = "" + shortPostID;
  let pad = "00000";
  let postID_NOW = pad.substring(0, pad.length - str.length) + str;
  shortPostID = shortPostID + 1;
  return postID_NOW;
};

module.exports =  {
  autoGen_shortID,
  autoGen_postID 
}
