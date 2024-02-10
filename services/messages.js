import moment from "moment";

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
    time: moment().format("h:mm a")
  };
}

export default formatMessage;
