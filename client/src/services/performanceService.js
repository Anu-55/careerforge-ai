import API from './api.js';

const getPerformance = async () => {
  const response = await API.get('/dashboard/performance');
  return response.data.data;
};

export { getPerformance };