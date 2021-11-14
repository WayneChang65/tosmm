const { randomBytes } = require('crypto')

function calculateParameters (range) {
  /* This does the equivalent of:
   *
   *    bitsNeeded = Math.ceil(Math.log2(range));
   *    bytesNeeded = Math.ceil(bitsNeeded / 8);
   *    mask = Math.pow(2, bitsNeeded) - 1;
   *
   * ... however, it implements it as bitwise operations, to sidestep any
   * possible implementation errors regarding floating point numbers in
   * JavaScript runtimes. This is an easier solution than assessing each
   * runtime and architecture individually.
   */

  let bitsNeeded = 0
  let bytesNeeded = 0
  let mask = 1

  while (range > 0) {
    if (bitsNeeded % 8 === 0) {
      bytesNeeded += 1
    }

    bitsNeeded += 1
    mask = mask << 1 | 1 /* 0x00001111 -> 0x00011111 */

    /* SECURITY PATCH (March 8, 2016):
     *   As it turns out, `>>` is not the right operator to use here, and
     *   using it would cause strange outputs, that wouldn't fall into
     *   the specified range. This was remedied by switching to `>>>`
     *   instead, and adding checks for input parameters being within the
     *   range of 'safe integers' in JavaScript.
     */
    range = range >>> 1 /* 0x01000000 -> 0x00100000 */
  }

  return { bitsNeeded, bytesNeeded, mask }
}

function randomBytesAsync (n) {
  return new Promise((resolve, reject) => {
    randomBytes(n, (err, buffer) => err ? reject(err) : resolve(buffer))
  })
}
function isSafeInteger (n) {
  /* We hardcode the values for the following:
   *
   * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
   * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
   * ... as Babel does not appear to transpile them, despite being ES6.
   */
  return !(n < -9007199254740991 || n > 9007199254740991)
}

async function secureRandomNumber (minimum, maximum) {
  if (typeof randomBytes !== 'function') throw new Error('NoRandomSource')
  if (minimum == null) throw new TypeError('MinNotNumber')
  if (maximum == null) throw new TypeError('MaxNotNumber')
  if (minimum % 1 !== 0) throw new RangeError('MinNotInteger')
  if (maximum % 1 !== 0) throw new RangeError('MaxNotInteger')
  if (!(maximum > minimum)) throw new RangeError('MinHigherThanMax')
  if (!isSafeInteger(minimum)) throw new RangeError('The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.')
  if (!isSafeInteger(maximum)) throw new RangeError('The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.')

  const range = maximum - minimum
  if (!isSafeInteger) throw new RangeError('The range between the minimum and maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.')

  const { bytesNeeded, mask } = calculateParameters(range)
  const bytes = await randomBytesAsync(bytesNeeded)
  let randomValue = 0
  /* Turn the random bytes into an integer, using bitwise operations. */
  for (let i = 0; i < bytesNeeded; i++) {
    randomValue |= (bytes[i] << (8 * i))
  }

  /* We apply the mask to reduce the amount of attempts we might need
   * to make to get a number that is in range. This is somewhat like
   * the commonly used 'modulo trick', but without the bias:
   *
   *   "Let's say you invoke secure_rand(0, 60). When the other code
   *    generates a random integer, you might get 243. If you take
   *    (243 & 63)-- noting that the mask is 63-- you get 51. Since
   *    51 is less than 60, we can return this without bias. If we
   *    got 255, then 255 & 63 is 63. 63 > 60, so we try again.
   *
   *    The purpose of the mask is to reduce the number of random
   *    numbers discarded for the sake of ensuring an unbiased
   *    distribution. In the example above, 243 would discard, but
   *    (243 & 63) is in the range of 0 and 60."
   *
   *   (Source: Scott Arciszewski)
   */
  randomValue = randomValue & mask

  if (randomValue <= range) {
    /* We've been working with 0 as a starting point, so we need to
     * add the `minimum` here. */
    return minimum + randomValue
  } else {
    // TODO: use a loop instead of recursing, otherwise we're just wasting
    //  resources on rerunning all validations.

    /* Outside of the acceptable range, throw it away and try again.
     * We don't try any modulo tricks, as this would introduce bias. */
    return secureRandomNumber(minimum, maximum)
  }
}

function randomSync (minimum, maximum) {
  // TODO: Considering to remove this boilerplate in favour of less maintenence.
  if (typeof randomBytes !== 'function') throw new Error('NoRandomSource')
  if (minimum == null) throw new TypeError('MinNotNumber')
  if (maximum == null) throw new TypeError('MaxNotNumber')
  if (minimum % 1 !== 0) throw new RangeError('MinNotInteger')
  if (maximum % 1 !== 0) throw new RangeError('MaxNotInteger')
  if (!(maximum > minimum)) throw new RangeError('MinHigherThanMax')
  if (!isSafeInteger(minimum)) throw new RangeError('The minimum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.')
  if (!isSafeInteger(maximum)) throw new RangeError('The maximum value must be inbetween MIN_SAFE_INTEGER and MAX_SAFE_INTEGER.')

  const range = maximum - minimum
  const { bytesNeeded, mask } = calculateParameters(range)
  // This variant uses a plain old loop instead of recursion.
  while (true) {
    const bytes = randomBytes(bytesNeeded)
    let randomValue = 0
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue |= (bytes[i] << (8 * i))
    }
    randomValue = randomValue & mask
    if (randomValue <= range) {
      return minimum + randomValue
    }
  }
}

module.exports = secureRandomNumber
module.exports.randomSync = randomSync
