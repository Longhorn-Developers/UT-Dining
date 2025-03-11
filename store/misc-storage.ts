import { MMKV, Mode } from 'react-native-mmkv';

export const miscStorage = new MMKV({ id: 'misc', mode: Mode.MULTI_PROCESS });
