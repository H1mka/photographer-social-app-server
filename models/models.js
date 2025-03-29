const { User } = require('./user')
const { Collection, CollectionPhotos } = require('./collection')
const { Comment } = require('./comment')
const { Photo, PhotoTags } = require('./photo')
const { Tag, PreferredTags } = require('./tag')

// У користувача є багато фото, але у одного фото є лише один користувач
User.hasMany(Photo, { foreignKey: 'user_id' })
Photo.belongsTo(User, { foreignKey: 'user_id' })

// У користувача є багато колекцій, але у одній колекції є лише один користувач
User.hasMany(Collection, { foreignKey: 'user_id' })
Collection.belongsTo(User, { foreignKey: 'user_id' })

// У користувача є багато бажаних тегів, і однакові теги може використовувати різні користувачі
User.belongsToMany(Tag, { through: PreferredTags, foreignKey: 'user_id' })
Tag.belongsToMany(User, { through: PreferredTags, foreignKey: 'tag_id' })

// У користувача є багато коментарів, але кожен коментар має лише 1 користувача
User.hasMany(Comment, { foreignKey: 'user_id' })
Comment.belongsTo(User, { foreignKey: 'user_id' })

Photo.belongsToMany(Tag, { through: PhotoTags, foreignKey: 'photo_id' })
Tag.belongsToMany(Photo, { through: PhotoTags, foreignKey: 'tag_id' })

// У фото є багато коментарів, але у одного коментаря може бути лише одне фото
Photo.hasMany(Comment, { foreignKey: 'photo_id' })
Comment.belongsTo(Photo, { foreignKey: 'photo_id' })

// У колекції є багато фото, і фото може бути у різних колекціях
Collection.belongsToMany(Photo, {
  through: CollectionPhotos,
  foreignKey: 'collection_id',
})
Photo.belongsToMany(Collection, {
  through: CollectionPhotos,
  foreignKey: 'photo_id',
})

module.exports = {
  User,
  Photo,
  Collection,
  Tag,
  Comment,
  PreferredTags,
  PhotoTags,
  CollectionPhotos,
}
