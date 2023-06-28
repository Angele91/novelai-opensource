import { client } from "./client";
import { getAccessKey } from "./encryption"

export const login = async (email, password) => {
  const accessKey = await getAccessKey(email, password);

  const response = await client.post('/user/login', {
    key: accessKey
  });

  return response.data;
}