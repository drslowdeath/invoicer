export function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args)
  } catch (e) {
    handleError(e, el, expression)
  }
}

export function handleError(error, el, expression = undefined) {
  error = Object.assign(error ?? { message: 'No error message given.' }, {
    el,
    expression,
  })

  console.warn(
    `Alpine Expression Error: ${error.message}\n\n${expression ? 'Expression: \"' + expression + '\"\n\n' : ''}`,
    el,
  )

  setTimeout(() => {
    throw error
  }, 0)
}
