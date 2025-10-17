import axios from 'axios';
import { BACKEND_ENDPOINT } from '../common/config';
import { mode } from '../common/types';

export const createConfig = (mode: mode, configName: string, config: any) => {
  return axios.post(BACKEND_ENDPOINT + `/config/${mode.toUpperCase()}/${configName}`, config, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const loadConfig = (mode: mode, configName: string) => {
  return axios.get(BACKEND_ENDPOINT + `/config/${mode.toUpperCase()}/${configName}`);
};

export const getConfigNamesByMode = (mode: mode) => {
  return axios.get(BACKEND_ENDPOINT + `/config/list/${mode.toUpperCase()}`);
};

export const deleteConfig = (mode: mode, configName: string) => {
  return axios.delete(BACKEND_ENDPOINT + `/config/${mode.toUpperCase()}/${configName}`);
};
