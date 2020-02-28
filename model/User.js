const UserStatus = require('./UserStatus');

module.exports = class User {
  constructor(id, name, status) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
  disconnect() {
    this.status = UserStatus.DISCONNECT;
  }
}
