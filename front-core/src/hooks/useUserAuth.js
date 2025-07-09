import { useContext } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};
