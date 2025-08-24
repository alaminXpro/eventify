const allRoles = {
  user: ['getEvents', 'manageUsers', 'getUsers', 'getClubs'],
  moderator: ['manageUsers', 'getUsers', 'manageEvents', 'getEvents', 'manageClubs', 'getClubs'],
  admin: ['manageUsers', 'getUsers', 'manageEvents', 'getEvents', 'manageClubs', 'addClub', 'getClubs', 'manageAdmins', 'getAdmins', 'manageEventStatus'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
