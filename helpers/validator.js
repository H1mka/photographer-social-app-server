class Validator {
  minPassLength = 6

  validatePassword(password) {
    return password && password.length <= this.minPassLength
  }
}

module.exports = new Validator()
