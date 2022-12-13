import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties, OnLoadData} from 'react-native-video';

import useSessionState from '../../../../state/state';
import VideoBase from '../../../VideoBase/VideoBase';
import DurationTimer, {
  DurationTimerHandle,
} from '../../../DurationTimer/DurationTimer';

const VideoPlayer = styled(VideoBase)({
  flex: 1,
});

const AudioPlayer = styled(VideoBase)({
  display: 'none',
});

const Duration = styled(DurationTimer)({
  position: 'absolute',
  right: 22,
  top: 16,
  width: 30,
  height: 30,
});

type VideoProps = {
  source: VideoProperties['source'];
  audioSource?: VideoProperties['source'];
  active: boolean;
  preview?: string;
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  resetCallback?: () => void;
};
const Video: React.FC<VideoProps> = ({
  active,
  source,
  audioSource,
  preview,
  autoPlayLoop = false,
  durationTimer = false,
  resetCallback,
}) => {
  const videoRef = useRef<RNVideo>(null);
  const timerRef = useRef<DurationTimerHandle>(null);
  const onEndRef = useRef<boolean>(false);
  const [duration, setDuration] = useState(0);
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const previousState = useRef({playing: false, timestamp: new Date()});

  const seek = useCallback((seconds: number) => {
    videoRef.current?.seek(seconds);
    timerRef.current?.seek(seconds);
  }, []);

  useEffect(() => {
    if (active && !autoPlayLoop && duration && exerciseState) {
      // Block is active, video and state is loaded
      const playing = exerciseState.playing;
      const timestamp = new Date(exerciseState.timestamp);

      // Reset onEndRef when playing
      if (playing) {
        onEndRef.current = false;
      }

      if (
        timestamp > previousState.current.timestamp &&
        previousState.current.playing === playing
      ) {
        // State is equal, but newer - reset to beginning
        seek(0);
      } else if (timestamp < previousState.current.timestamp && playing) {
        // State is old - compensate time played
        const timeDiff = (new Date().getTime() - timestamp.getTime()) / 1000;
        if (timeDiff < duration) {
          // Do not seek passed video length
          seek(timeDiff);
        } else {
          seek(duration - 1);
        }
      }

      // Update previous state
      previousState.current = {
        playing,
        timestamp,
      };
    }
  }, [active, autoPlayLoop, duration, previousState, exerciseState, seek]);

  const onLoad = useCallback<(data: OnLoadData) => void>(
    data => {
      setDuration(data.duration);
    },
    [setDuration],
  );

  const onEnd = useCallback(() => {
    // seek(0) does not reset progress so a second onEnd is triggered
    // Check that the progressRef is not set back to zero to trigger a reset
    if (resetCallback && !autoPlayLoop && !onEndRef.current) {
      onEndRef.current = true;
      resetCallback();
    }
  }, [resetCallback, autoPlayLoop]);

  const paused = !active || (!exerciseState?.playing && !autoPlayLoop);

  const videoProps: VideoProperties = useMemo(
    () => ({
      source,
      poster: preview,
      resizeMode: 'contain',
      posterResizeMode: 'contain',
      paused,
    }),
    [paused, preview, source],
  );

  const timer = useMemo(
    () =>
      durationTimer ? (
        <Duration duration={duration} paused={paused} ref={timerRef} />
      ) : null,
    [durationTimer, paused, duration],
  );

  if (audioSource) {
    // If audio source is available we allways loop the video and handle the audio separateley as the primary playing source
    return (
      <>
        <AudioPlayer
          source={audioSource}
          audioOnly
          ref={videoRef}
          onLoad={onLoad}
          repeat={autoPlayLoop}
          paused={paused}
        />
        <VideoPlayer {...videoProps} muted repeat />
        {timer}
      </>
    );
  }

  return (
    <>
      <VideoPlayer
        {...videoProps}
        ref={videoRef}
        onLoad={onLoad}
        onEnd={onEnd}
        repeat={autoPlayLoop}
      />
      {timer}
    </>
  );
};

export default Video;
