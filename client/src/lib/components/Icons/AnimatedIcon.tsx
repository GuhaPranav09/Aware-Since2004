import React, {forwardRef} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import {LottieViewProps} from 'lottie-react-native';

export type AnimatedIconProps = LottieViewProps & {fill?: string};
export type AnimatedIconType = React.FC<
  Omit<AnimatedIconProps, 'source'> & {ref: React.Ref<AnimatedLottieView>}
>;

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
  width: '100%',
  height: '100%',
});

const AnimatedIcon: React.FC<
  AnimatedIconProps & {ref: React.Ref<AnimatedLottieView>}
> = forwardRef<AnimatedLottieView, LottieViewProps>(
  ({source, ...rest}, ref) => {
    return <Lottie ref={ref} source={source} {...rest} />;
  },
);

export default AnimatedIcon;
