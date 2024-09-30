import request from '../fetch';

export const fetchLabelList = async () => request.get('/api/label/list');