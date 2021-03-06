"use strict";

var rooms = [];

var addUser = function addUser(id) {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i] === id) {
      return;
    }
  }

  rooms.push(String(id));
};

var deleteUser = function deleteUser(id) {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i] === id) {
      rooms.splice(i, 1);
    }
  }
};

var getRooms = function getRooms() {
  return rooms;
};

var online = function online(id) {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i] === id) {
      return true;
    }
  }

  return false;
};

module.exports = {
  addUser: addUser,
  deleteUser: deleteUser,
  getRooms: getRooms,
  online: online
};