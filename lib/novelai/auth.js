import { client } from "./client";
import { decryptData, getAccessKey } from "./encryption"

/**
 * Logs in a user with the given email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<any>} A Promise that resolves to the response data.
 */
export const login = async (email, password) => {
  const accessKey = await getAccessKey(email, password);

  const response = await client.post('/user/login', {
    key: accessKey
  });

  return response.data;
}

/**
 * Retrieves the user's keystore using the provided encryption key and access token.
 *
 * @param {type} encryptionKey - The encryption key used to decrypt the user's keystore.
 * @param {type} accessToken - The access token used to authenticate the API request.
 * @return {type} The decrypted keystore data.
 */
export const getKeystore = async (encryptionKey, accessToken) => {
  const response = await client.get('/user/keystore', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  console.log(encryptionKey);

  const { data } = response;
  const { keystore } = data;

  const keystoreStr = Buffer.from(keystore, 'base64').toString('utf-8');
  let { nonce, sdata } = JSON.parse(keystoreStr);

  const decrypted = decryptData(
    new Uint8Array(sdata),
    encryptionKey,
    new Uint8Array(nonce)
  );
  
  return decrypted;
}