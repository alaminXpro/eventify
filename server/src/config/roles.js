const allRoles = {
  user: ['getEvents', 'getClubs'],
  moderator: ['manageUsers', 'getUsers', 'manageEvents', 'getEvents', 'manageClubs', 'getClubs'],
  admin: ['manageUsers', 'getUsers', 'manageEvents', 'getEvents', 'manageClubs', 'getClubs', 'manageAdmins', 'getAdmins'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
