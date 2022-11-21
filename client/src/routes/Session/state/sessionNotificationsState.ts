import create from 'zustand';
import {IconType} from '../../../common/components/Icons';

export type NotificationProps = {
  text: string;
  letter?: string;
  Icon?: IconType;
  image?: string;
  timeVisible?: number;
  visible?: boolean;
};

type State = {
  notifications: NotificationProps[];
};

type Actions = {
  addNotification: (notification: NotificationProps) => void;
  reset: () => void;
};

const initialState: State = {
  notifications: [],
};

const useSessionNotificationsState = create<State & Actions>()(set => ({
  ...initialState,
  addNotification: notification =>
    set(state => ({notifications: [...state.notifications, notification]})),
  reset: () => set(initialState),
}));

export default useSessionNotificationsState;
