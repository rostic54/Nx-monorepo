export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    events: string;
    user: string;
  };
}

export const API_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:3000', // Default for dev
  endpoints: {
    events: '/appointments',
    user: '/user',
  },
};


export const getApiConfig = (env: 'development' | 'production' = 'development'): ApiConfig => {
  if (env === 'production') {
    return {
      ...API_CONFIG,
      baseUrl: 'https://api.mycalendar.com',
    };
  }
  return API_CONFIG;
};