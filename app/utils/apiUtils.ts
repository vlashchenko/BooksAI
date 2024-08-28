// apiUtils.ts
import axios from 'axios';

export const postWithAuth = async (url: string, data: any, jwtToken: string) => {
  return await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};