import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const WandIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M15.951 5.175a.977.977 0 0 0-.96-.96.969.969 0 0 0-.951.96v2.891a.96.96 0 0 0 .95.951c.518 0 .961-.433.961-.95V5.174Zm2.985 4.134a.96.96 0 0 0 .01 1.347.96.96 0 0 0 1.346 0l2.015-2.025c.368-.358.368-.989 0-1.356a.97.97 0 0 0-1.346.01l-2.025 2.024ZM9.69 10.656a.97.97 0 0 0 1.347 0 .96.96 0 0 0 0-1.347L9.03 7.294a.97.97 0 0 0-1.347-.019.96.96 0 0 0 0 1.347l2.006 2.034Zm12.797 13.23c.462.471 1.253.462 1.705 0a1.232 1.232 0 0 0 0-1.704l-8.946-8.993c-.462-.462-1.253-.462-1.705 0a1.231 1.231 0 0 0 0 1.704l8.946 8.993ZM5.574 13.641a.963.963 0 0 0-.96.95c0 .519.432.962.96.962h2.89c.519 0 .961-.443.961-.961a.969.969 0 0 0-.96-.951H5.574Zm18.843 1.912c.518 0 .96-.443.96-.961a.969.969 0 0 0-.96-.951h-2.891a.969.969 0 0 0-.96.95c0 .519.442.962.96.962h2.89Zm-7.242 1.807-2.834-2.834c-.188-.198-.264-.424-.066-.612.17-.17.405-.123.612.075l2.825 2.835-.537.536Zm-9.501 3.183a.979.979 0 0 0-.02 1.347c.368.367 1 .377 1.357.019l2.025-2.015a.96.96 0 0 0 0-1.347.96.96 0 0 0-1.347-.01l-2.015 2.006Zm8.277.584a.977.977 0 0 0-.96-.96.969.969 0 0 0-.951.96v2.891c0 .518.433.96.95.96.518 0 .961-.442.961-.96v-2.89Z"
      fill={fill}
    />
  </Icon>
);