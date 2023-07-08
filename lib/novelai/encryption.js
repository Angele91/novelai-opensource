import * as blake from 'blakejs';
import * as argon2 from 'argon2';
import * as tweetnacl from 'tweetnacl';
import { startsWith } from './utils';


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

  const hashed = await argon2.hash(Buffer.from(password), {
    salt: Buffer.from(salt),
    timeCost: 2,
    memoryCost: Math.round(2000000 / 1024),
    parallelism: 1,
    hashLength: size,
    type: argon2.argon2id,
  })

  return hashed;
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
 * @return {Promise<Uint8Array>} - A Promise that resolves to the encryption key as a hexadecimal string.
 */
export const getEncryptionKey = async (email, password) => {
  const hash = await getArgonHash(email, password, 128, "novelai_data_encryption_key");
  const str = hash.replaceAll('=', '');
  return blake.blake2b(str, undefined, 32);
}

const COMPRESSION_PREFIX = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);

/**
 * Decrypts the given data using the provided key and nonce.
 *
 * @param {any} data - The data to decrypt.
 * @param {any} key - The key used for decryption.
 * @param {any} [nonce=null] - The nonce used for decryption. Defaults to null.
 * @return {any} The decrypted data.
 */
export const decryptData = (data, key, nonce = null) => {
    // data is compressed
    const isCompressed = startsWith(data, COMPRESSION_PREFIX);
    if (isCompressed) {
        data = data.slice(COMPRESSION_PREFIX.length);
    }

    if (nonce === null) {
      nonce = data.slice(0, tweetnacl.box.nonceLength);
      data = data.slice(tweetnacl.box.nonceLength);
    }

    const openedBox = tweetnacl.secretbox.open(data, nonce, key);
    
    return openedBox;
}