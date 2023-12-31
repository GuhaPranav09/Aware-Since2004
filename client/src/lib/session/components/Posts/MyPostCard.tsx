import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {UserProfileType} from '../../../../../../shared/src/schemas/User';
import {Body14} from '../../../components/Typography/Body/Body';
import SETTINGS from '../../../constants/settings';
import {SPACINGS} from '../../../constants/spacings';
import BylineUser from '../../../components/Bylines/BylineUser';
import {Spacer4, Spacer8} from '../../../components/Spacers/Spacer';
import Badge from '../../../components/Badge/Badge';
import {EarthIcon, PrivateEyeIcon} from '../../../components/Icons';
import {useTranslation} from 'react-i18next';
import {Dimensions, ViewStyle} from 'react-native';

const SharingCard = styled.View<{inList?: boolean}>(({inList}) => ({
  backgroundColor: COLORS.CREAM,
  borderRadius: 24,
  width: inList ? Dimensions.get('screen').width * 0.75 : undefined,
  padding: SPACINGS.SIXTEEN,
  marginBottom: SPACINGS.SIXTEEN,
  ...SETTINGS.BOXSHADOW,
}));

const HeaderRow = styled.View({
  flexDirection: 'row',
});

type MyPostCardProps = {
  userProfile?: UserProfileType | null;
  text: string;
  isPublic: boolean;
  inList?: boolean;
  style?: ViewStyle;
};

const MyPostCard: React.FC<MyPostCardProps> = ({
  text,
  userProfile,
  isPublic,
  inList,
  style,
}) => {
  const {t} = useTranslation('Component.MyPostCard');

  return (
    <SharingCard inList={inList} style={style}>
      <HeaderRow>
        <BylineUser user={userProfile} />
        <Spacer4 />
        <Badge
          IconBefore={isPublic ? <EarthIcon /> : <PrivateEyeIcon />}
          text={isPublic ? t('everyoneLabel') : t('onlyMeLabel')}
        />
      </HeaderRow>
      <Spacer8 />
      <Body14>{text}</Body14>
    </SharingCard>
  );
};

export default React.memo(MyPostCard);
