const users = [];

/**
 * User joins to chat.
 * @param {*} id 
 * @param {*} username 
 * @param {*} group 
 * @returns
 */
function userJoins(id, username, group) {
  const user = { id, username, group };
  users.push(user);
  return user;
}

/**
 * Get current user.
 * @param {*} id 
 * @returns 
 */
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

/**
 * User leaves chat.
 * @param {*} id 
 * @returns 
 */
function userLeaves(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/**
 * Get group from users.
 * @param {*} group 
 * @returns 
 */
function getGroupUsers(group) {
  return users.filter(user => user.group === group);
}

export {
  userJoins,
  getCurrentUser,
  userLeaves,
  getGroupUsers
};
