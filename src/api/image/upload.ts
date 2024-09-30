import request from '../fetch';

export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/api/image/upload', formData);
};