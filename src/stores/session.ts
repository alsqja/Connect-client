import { IUserWithToken } from "../hooks";
import { atom, DefaultValue, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export const { persistAtom } = recoilPersist();

const tokenState = atom<string | null>({
  default: null,
  key: "session/token",
  effects_UNSTABLE: [persistAtom],
} as any);

export const tokenSelector = selector<string | null>({
  get: ({ get }) => get(tokenState),
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue || !newValue?.length) {
      reset(tokenState);
    } else {
      set(tokenState, newValue);
    }
  },
  key: "session/token/selector",
});

/***
 * @description 유저 세션 유무
 * @returns boolean token이 있는 경우 true
 */
export const hasSessionSelector = selector<boolean>({
  get: ({ get }) => !!get(tokenSelector),
  key: "session/has-session",
});

export const userState = atom<IUserWithToken | null>({
  default: null,
  key: "session/user",
  effects_UNSTABLE: [persistAtom],
});
