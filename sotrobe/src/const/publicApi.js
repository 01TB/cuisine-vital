import axios from 'axios';

const base = import.meta.env.VITE_API_URL;
const publicApi = axios.create({ baseURL: base });

export default publicApi;
