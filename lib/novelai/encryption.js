import * as blake from 'blakejs';
import * as argon2 from 'argon2';

/**
 * Replaces all occurrences of '/' with '_' and '+' with '-' in the given string.
 *
 * @param {string} str - The input string to be cleaned.
 * @return {string} The cleaned string with replaced characters.
 */
const cleanKey = (str) => str.replaceAll('/', '_')
  .replaceAll('+', '-');

/**
 * Generates an Argon2 hash of a given password for a given user's email,
 * with customizable parameters for time, memory, and hash size.
 *
 * @param {string} email - The user's email
 * @param {string} password - The password to hash
 * @param {number} size - The desired size of the hash
 * @param {string} domain - The user's domain
 * @return {Promise<string>} The generated hash
 */
export const getArgonHash = async (email, password, size, domain) => {
  const preSalt = `${password.slice(0, 6)}${email}${domain}`;
  const salt = blake.blake2b(preSalt, undefined, 16);

  const raw = await argon2.hash(Buffer.from(password), {
    salt: Buffer.from(salt),
    timeCost: 2,
    memoryCost: Math.round(2000000 / 1024),
    parallelism: 1,
    hashLength: size,
    type: argon2.argon2id,
  })

  return raw;
};

/**
 * Asynchronously generates an access key using the given email and password
 * by hashing them with Argon and returning the first 64 characters of the hash.
 *
 * @param {string} email - the email to use for hashing
 * @param {string} password - the password to use for hashing
 * @return {Promise<string>} the generated access key as a Promise
 */
export const getAccessKey = async (email, password) => {
  const hash = await getArgonHash(email, password, 64, "novelai_data_access_key");
  const b64Buff = Buffer.from(hash, 'utf-8');
  const b64Str = b64Buff.toString('utf-8');
  const normalizedB64Str = b64Str.replaceAll('/', '_');
  const normalizedKey = normalizedB64Str.replaceAll('+', '-');

  return normalizedKey.slice(53, 117);
}

/**
 * Returns an encryption key that is derived from an email and password combination.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<string>} - A Promise that resolves to the encryption key as a hexadecimal string.
 */
export const getEncryptionKey = async (email, password) => {
  const preKey = await getArgonHash(email, password, 128, "novelai_data_encryption_key");
  const b64Hash = Buffer.from(preKey).toString('base64');
  let keyString = cleanKey(b64Hash);

  while(keyString.endsWith('=')) {
    keyString = keyString.slice(0, keyString.length - 1);
  }

  return blake2b.blake2bHex(preKey, undefined, 32);
}