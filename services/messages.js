import moment from "moment-timezone";

/**
 * Format for message.
 * @param {*} username 
 * @param {*} text 
 * @returns 
 */
function formatMessage(username, text, isOwnMsg=false) {
  return {
    isOwnMsg,
    username,
    text,
    time: moment().tz("Asia/Jakarta").format("h:mm a")
  };
}

export default formatMessage;
