const createUserAvatarUrl = (user) => {
  if (typeof user !== 'object') return ''
  const { avatar, avatar_folder } = user
  if (!avatar || !avatar_folder) return null

  return `${process.env.HOST_NAME}/${avatar_folder}/${avatar}`
}

const prepareUserData = (user = {}) => {
  if (typeof user !== 'object') return {}

  const { id, name, last_name, email, role, avatar, bio, avatar_folder } = user
  const avatar_src = avatar && avatar_folder ? createUserAvatarUrl(user) : null

  return { id, name, last_name, email, role, bio, avatar_src }
}

module.exports = { prepareUserData, createUserAvatarUrl }
