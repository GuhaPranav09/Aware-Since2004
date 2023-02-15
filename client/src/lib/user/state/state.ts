import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, persist} from 'zustand/middleware';
import {omit} from 'ramda';

import {LiveSession} from '../../../../../shared/src/types/Session';
import migrate from './migration';
import {UserProfile} from '../../../../../shared/src/types/User';
import {
  UserEvent,
  UserEventData,
  FeedbackEventData,
  PostEventData,
} from '../../../../../shared/src/types/Event';

const USER_STATE_VERSION = 3;

type PinnedSession = {
  id: string;
  expires: Date;
};

export type CompletedSession = {
  id: LiveSession['id'];
  hostId?: LiveSession['hostId'];
  exerciseId: LiveSession['exerciseId'];
  language: LiveSession['language'];
  type: LiveSession['type'];
  mode: LiveSession['mode'];
  completedAt: Date;
  hostProfile?: UserProfile;
};

export type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  completedSessions?: Array<CompletedSession>;
  userEvents?: Array<UserEvent>;
  metricsUid?: string;
  reminderNotifications?: boolean;
};

type SetCurrentUserState = (
  setter:
    | Partial<UserState>
    | ((userState: Partial<UserState>) => Partial<UserState>),
) => void;

export type State = {
  user: FirebaseAuthTypes.User | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
  userState: {[key: string]: UserState};
};

export type PersistedState = Pick<State, 'userState'>;

export type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  setPinnedSessions: (pinnedSessions: Array<PinnedSession>) => void;
  addCompletedSession: (completedSession: CompletedSession) => void;
  addUserEvent: (
    type: UserEvent['type'],
    payload: UserEvent['payload'],
  ) => void;
  setCurrentUserState: SetCurrentUserState;
  reset: (isDelete?: boolean) => void;
};

const initialState: State = {
  user: null,
  claims: {},
  userState: {},
};

// We don't use selectors but for this case we do :)
// This should only be used in hooks where we can memoize with useCallback or useMemo
type GetCurrentUserStateSelector = (state: State) => UserState | undefined;
export const getCurrentUserStateSelector: GetCurrentUserStateSelector = ({
  user,
  userState,
}) => {
  if (user?.uid) {
    return userState[user.uid];
  }
};

const getTypedEvent = (event: UserEventData) => {
  switch (event.type) {
    case 'post':
      return event as PostEventData;
    default:
      return event as FeedbackEventData; // some type has to be the fallback
  }
};

const useUserState = create<State & Actions>()(
  persist(
    (set, get) => {
      const setCurrentUserState: SetCurrentUserState = setter => {
        const {user} = get();
        if (user?.uid) {
          const currentState = getCurrentUserStateSelector(get()) ?? {};
          const newState =
            typeof setter === 'function' ? setter(currentState) : setter;

          set(({userState}) => ({
            userState: {
              ...userState,
              [user.uid]: {
                ...currentState,
                ...newState,
              },
            },
          }));
        }
      };

      return {
        ...initialState,
        setUser: user => set({user}),
        setClaims: claims => set({claims}),
        setUserAndClaims: ({user, claims}) => set({user, claims}),

        setCurrentUserState,
        setPinnedSessions: pinnedSessions =>
          setCurrentUserState({pinnedSessions}),
        addCompletedSession: completedSession =>
          setCurrentUserState(({completedSessions = []} = {}) => ({
            completedSessions: [...completedSessions, completedSession],
          })),
        addUserEvent: (type, payload) => {
          const typedEventData = getTypedEvent({type, payload});
          setCurrentUserState(({userEvents: events = []} = {}) => ({
            userEvents: [...events, {...typedEventData, timestamp: new Date()}],
          }));
        },
        reset: isDelete => {
          const {user} = get();
          if (isDelete && user?.uid) {
            // Remove the state specific to the user on delete
            set(({userState}) => ({
              ...initialState,
              userState: omit([user.uid], userState),
            }));
          } else {
            // Keep persisted state in case of sign out
            set(({userState}) => ({...initialState, userState}));
          }
        },
      };
    },
    {
      name: 'userState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({userState}): PersistedState => ({userState}),
      // In dev I had change this with the app closed (android)
      // otherwise the "migrate" functions does not run due to diff failure
      version: USER_STATE_VERSION,
      migrate,
    },
  ),
);

export default useUserState;
