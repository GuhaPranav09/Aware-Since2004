import React, {useCallback, useState} from 'react';
import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Extrapolate} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {Body16, BodyBold} from '../../../lib/components/Typography/Body/Body';
import Button from '../../../lib/components/Buttons/Button';
import {useTranslation} from 'react-i18next';
import useAppState from '../../../lib/appState/state/state';
import {ArrowRightIcon} from '../../../lib/components/Icons';
import GetStarted from './components/GetStarted';
import AboutCarousel from './components/AboutCarousel';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import Footer from './components/Footer';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import * as linking from '../../../lib/linking/nativeLinks';

const WINDOW_WIDTH = Dimensions.get('window').width;
const BACKGROUND_SEGMENTS = 4;

const Background = styled(Animated.Image).attrs({
  source: {uri: Platform.select({android: 'forest', ios: 'forest.jpg'})},
})({
  ...StyleSheet.absoluteFillObject,
  width: WINDOW_WIDTH * BACKGROUND_SEGMENTS,
});

const Screens = styled(Animated.View)({
  position: 'absolute',
  width: WINDOW_WIDTH * 2,
  height: '100%',
  left: 0,
  top: 0,
  flexDirection: 'row',
});

const Screen = styled.View({
  width: WINDOW_WIDTH,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const Underline = styled(Body16)({
  textDecorationLine: 'underline',
  color: COLORS.WHITE,
});

const Onboarding = () => {
  const {t} = useTranslation('Screen.Onboarding');
  const setSettings = useAppState(state => state.setSettings);

  const [lastPage, setLastPage] = useState(false);

  const screensX = useSharedValue(0);
  const scrollX = useSharedValue(0);

  const screensStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: screensX.value,
      },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          [0, WINDOW_WIDTH * BACKGROUND_SEGMENTS - 1],
          [0, -(WINDOW_WIDTH * BACKGROUND_SEGMENTS - 1)],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onPageChange = useCallback(
    (index: number, count: number) => {
      setLastPage(index === count - 1);
    },
    [setLastPage],
  );

  const onContinuePress = useCallback(() => {
    screensX.value = withTiming(screensX.value - WINDOW_WIDTH, {duration: 400});
  }, [screensX]);

  const onGetStartedPress = useCallback(() => {
    setSettings({showOnboarding: false});
  }, [setSettings]);

  const onPrivacyNoticePress = useCallback(() => {
    linking.openURL(t('privacyNoticeUrl'));
  }, [t]);

  return (
    <>
      <StatusBar hidden />
      <Screens style={screensStyle}>
        <Background style={backgroundStyle} />
        <Screen>
          <AboutCarousel onScroll={onScroll} onPageChange={onPageChange} />
          <Footer>
            <Button onPress={onContinuePress}>
              <BodyBold>
                {lastPage ? t('continueButton') : t('skipButton')}
              </BodyBold>
            </Button>
          </Footer>
        </Screen>
        <Screen>
          <GetStarted />
          <Footer>
            <Button onPress={onGetStartedPress} RightIcon={ArrowRightIcon}>
              <BodyBold>{t('getStartedButton')}</BodyBold>
            </Button>
            <Spacer16 />
            <TouchableOpacity onPress={onPrivacyNoticePress}>
              <Underline>{t('privacyNotice')}</Underline>
            </TouchableOpacity>
          </Footer>
        </Screen>
      </Screens>
    </>
  );
};

export default Onboarding;
