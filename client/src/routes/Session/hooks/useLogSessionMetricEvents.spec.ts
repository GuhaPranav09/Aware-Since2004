import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import {Session} from '../../../../../shared/src/types/Session';
import {logEvent} from '../../../lib/metrics';
import useUserState from '../../../lib/user/state/state';
import useSessionState from '../state/state';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';

jest.mock('../../../lib/metrics');

jest.mock('../../../lib/content/hooks/useExerciseById', () => () => ({
  id: 'some-exercise-id',
  slides: ['slide 1', 'slide 2', 'slide 3'],
}));

const mockedLogEvent = jest.mocked(logEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useLogSessionMetricEvents', () => {
  describe('logSessionMetricEvent', () => {
    it('logs events with specific properties', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          type: 'private',
          hostId: 'some-host-id',
          startTime: '2022-02-02T02:02:02Z',
          contentId: 'some-content-id',
          language: 'en',
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.logSessionMetricEvent('Enter Intro Portal');

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith('Enter Intro Portal', {
        'Sharing Session ID': 'some-session-id',
        'Sharing Session Type': 'private',
        'Sharing Session Start Time': '2022-02-02T02:02:02Z',
        'Sharing Session Duration': expect.any(Number),
        'Exercise ID': 'some-content-id',
        Language: 'en',
        Host: false,
      });
    });

    it('resolves the host event property', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          hostId: 'some-user-id',
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.logSessionMetricEvent('Enter Intro Portal');

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith(
        'Enter Intro Portal',
        expect.objectContaining({
          Host: true,
        }),
      );
    });

    it('resolves the duration event property', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          startTime: dayjs().subtract(1, 'hour').toISOString(),
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.logSessionMetricEvent('Enter Intro Portal');

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith(
        'Enter Intro Portal',
        expect.objectContaining({
          'Sharing Session Duration': 3600,
        }),
      );
    });
  });

  describe('conditionallyLogLeaveSessionMetricEvent', () => {
    it('logs if not on the last slide', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          contentId: 'some-content-id',
          exerciseState: {
            index: 0,
          },
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.conditionallyLogLeaveSessionMetricEvent();

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith(
        'Leave Sharing Session',
        expect.any(Object),
      );
    });

    it('does not log on the last slide', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          contentId: 'some-content-id',
          exerciseState: {
            index: 2,
          },
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.conditionallyLogLeaveSessionMetricEvent();

      expect(mockedLogEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('conditionallyLogCompleteSessionMetricEvent', () => {
    it('logs only on last slide', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          contentId: 'some-content-id',
          exerciseState: {
            index: 2,
          },
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.conditionallyLogCompleteSessionMetricEvent();

      expect(mockedLogEvent).toHaveBeenCalledTimes(1);
      expect(mockedLogEvent).toHaveBeenCalledWith(
        'Complete Sharing Session',
        expect.any(Object),
      );
    });

    it('does not log on slides other than the last', () => {
      useUserState.setState({
        user: {
          uid: 'some-user-id',
        } as FirebaseAuthTypes.User,
      });

      useSessionState.setState({
        session: {
          id: 'some-session-id',
          contentId: 'some-content-id',
          exerciseState: {
            index: 0,
          },
        } as Session,
      });

      const {result} = renderHook(() => useLogSessionMetricEvents());

      result.current.conditionallyLogCompleteSessionMetricEvent();

      expect(mockedLogEvent).toHaveBeenCalledTimes(0);
    });
  });
});