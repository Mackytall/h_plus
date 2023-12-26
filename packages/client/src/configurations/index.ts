const PREFIX = 'api';
const PROD_URL = import.meta.env.VITE_PROD_URL;
const DEV_URL = 'http://localhost';
const API_URL = 'https://boucheries.imadelmahrad.com'

const prod = {
  boucheries: `${API_URL}/${PREFIX}/boucheries-server`,
  auth: `${API_URL}/${PREFIX}/auth`,
};

const dev = {
  boucheries: `${DEV_URL}:4000/${PREFIX}/boucheries-server`,
  auth: `${DEV_URL}:3000/${PREFIX}/auth`,
};

export const urls =  import.meta.env.PROD ? { ...prod } : { ...dev };
