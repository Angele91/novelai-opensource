import { API_URL } from '@/lib/novelai/constants';
import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.novelai.net/",
})