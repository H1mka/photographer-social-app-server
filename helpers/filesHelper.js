const fs = require('fs')
const uuid = require('uuid')
const path = require('path')

class FilesHelper {
  userName = ''
  userLastName = ''
  userId = ''
  folderName = ''
  fileName = ''

  constructor(userName = '', userLastName = '', userId = '', filePrefix = '') {
    this.userName = userName
    this.userLastName = userLastName
    this.userId = userId

    this.generateFolderName()
    this.generateFileName(filePrefix)
  }

  generateFolderName() {
    const { userName, userLastName, userId } = this
    this.folderName = `${userName}_${userLastName}_${userId}`.trim()
  }

  generateFileName(filePrefix) {
    this.fileName = filePrefix + uuid.v4() + '.jpg'
  }

  uploadPhotoToFolder(image) {
    /* Upload photo to folder and create folder if needed */
    try {
      const { folderName, fileName } = this
      const uploadPath = path.resolve(__dirname, '..', 'static', folderName)
      const filePath = path.join(uploadPath, fileName)

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath)
      }

      image.mv(filePath)
    } catch (error) {
      throw error
    }
  }
}

module.exports = FilesHelper
