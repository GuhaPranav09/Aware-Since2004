import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const LinkIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="m14.611 18.545 1.28-1.297c-.987-.083-1.698-.41-2.208-.92-1.413-1.413-1.413-3.411-.008-4.808l2.776-2.784c1.413-1.405 3.403-1.414 4.817 0 1.421 1.421 1.404 3.411.008 4.816l-1.422 1.414c.268.618.36 1.37.21 2.023l2.391-2.383c2.057-2.049 2.066-4.976-.008-7.05-2.082-2.082-4.993-2.065-7.05-.008l-2.91 2.91c-2.057 2.057-2.065 4.976.008 7.05.486.493 1.155.861 2.116 1.037Zm.778-7.067-1.28 1.297c.987.092 1.698.41 2.208.92 1.422 1.413 1.413 3.411.008 4.816l-2.776 2.777c-1.413 1.413-3.403 1.413-4.808 0-1.422-1.422-1.413-3.404-.009-4.809l1.414-1.421a3.42 3.42 0 0 1-.21-2.024l-2.391 2.391c-2.057 2.05-2.066 4.968.008 7.042 2.083 2.082 4.993 2.065 7.05.016l2.91-2.918c2.057-2.057 2.065-4.976-.009-7.05-.485-.485-1.145-.853-2.115-1.037Z"
      fill={fill}
    />
  </Icon>
);