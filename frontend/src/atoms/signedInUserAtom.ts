import { atom } from 'jotai';
import { UserWithId } from '../services/usersApi';

export const signedInUserAtom = atom<UserWithId | undefined>(undefined);
