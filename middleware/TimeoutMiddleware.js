const timeoutMiddleware = async (req, res, next) => {
  try {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 5000)
    })

    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = timeoutMiddleware
