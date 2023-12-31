import {useCallback, useEffect, useState} from 'react';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState from '../../user/state/state';
import * as minfulMinutes from '../lib/logMindfulMinutes';
import {logEvent} from '../../metrics';

const useLogMindfulMinutes = () => {
  const userState = useCurrentUserState();
  const setUserState = useUserState(state => state.setCurrentUserState);
  const [mindfulMinutesAvailable, setAvailable] = useState(false);
  const [mindfulMinutesEnabled, setEnabled] = useState<boolean | undefined>(
    userState?.logMindfulMinutes,
  );

  const updateAvailable = useCallback(async () => {
    setAvailable(await minfulMinutes.isAvailable());
  }, []);

  const updateEnabled = useCallback(async () => {
    const authorized = await minfulMinutes.getAuthorizationStatus();

    if (userState?.logMindfulMinutes !== undefined) {
      setEnabled(authorized && userState?.logMindfulMinutes);
    } else {
      setEnabled(undefined);
    }
  }, [userState?.logMindfulMinutes]);

  const setMindfulMinutesEnabled = useCallback(
    async (enable: boolean) => {
      if (enable) {
        await minfulMinutes.requestAuthorization();
      }

      setUserState({logMindfulMinutes: enable});

      logEvent('Toggle Mindful Minutes Logging', {Enable: enable});
    },
    [setUserState],
  );

  const logMindfulMinutes = useCallback(
    async (start: Date, end: Date = new Date()) => {
      if (mindfulMinutesEnabled) {
        await minfulMinutes.log(start, end);
      }
    },
    [mindfulMinutesEnabled],
  );

  useEffect(() => {
    updateAvailable();
    updateEnabled();
  }, [updateAvailable, updateEnabled]);

  return {
    mindfulMinutesAvailable,
    mindfulMinutesEnabled,
    setMindfulMinutesEnabled,
    logMindfulMinutes,
  };
};

export default useLogMindfulMinutes;
