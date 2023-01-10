import {BottomSheetScrollView, useBottomSheet} from '@gorhom/bottom-sheet';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer8,
  Spacer96,
} from '../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  Heading16,
  Heading24,
  ModalHeading,
} from '../../lib/components/Typography/Heading/Heading';
import {BottomSheetTextInput} from '../../lib/components/Typography/TextInput/TextInput';
import * as metrics from '../../lib/metrics';
import {ModalStackProps} from '../../lib/navigation/constants/routes';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {DEFAULT_LANGUAGE_TAG} from '../../lib/i18n';
import {Display36} from '../../lib/components/Typography/Display/Display';

const Votes = styled.View({
  flexDirection: 'row',
});

const Vote = styled.Text<{selected: boolean}>(({selected}) => ({
  width: 125,
  height: 125,
  fontSize: 75,
  lineHeight: 125,
  textAlign: 'center',
  borderRadius: 62.5,
  borderWidth: 5,
  borderColor: selected ? COLORS.PRIMARY : 'transparent',
  overflow: 'hidden',
}));

const Wrapper = styled(Gutters)({
  alignItems: 'center',
  justifyContent: 'center',
});

const TextField = styled(BottomSheetTextInput)({
  height: 80,
  width: '100%',
});

const Submitted = styled.View({
  height: 200,
  alignItems: 'center',
  justifyContent: 'center',
});

const SessionFeedbackModal = () => {
  const {t} = useTranslation('Modal.SessionFeedback');
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'SessionFeedbackModal'>>();
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {snapToIndex} = useBottomSheet();
  const {sessionId, completed, isHost} = params;

  const [answer, setAnswer] = useState<undefined | boolean>();
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const thumbsUpPress = useCallback(() => {
    snapToIndex(2);
    setAnswer(true);
  }, [snapToIndex, setAnswer]);

  const thumbsDownPress = useCallback(() => {
    snapToIndex(2);
    setAnswer(false);
  }, [snapToIndex, setAnswer]);

  const submit = useCallback(() => {
    metrics.logEvent('Sharing Session Feedback', {
      'Feedback Question': t('question', {lng: DEFAULT_LANGUAGE_TAG}),
      'Feedback Answer': answer,
      'Feedback Comment': comment,
      'Sharing Session ID': sessionId,
      'Sharing Session Completed': completed,
      Host: isHost,
    });
    setSubmitted(true);
  }, [t, sessionId, completed, isHost, answer, comment, setSubmitted]);

  useEffect(() => {
    if (submitted) {
      snapToIndex(0);
      const timer = setTimeout(popToTop, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, snapToIndex, popToTop]);

  if (submitted) {
    return (
      <SheetModal>
        <Submitted>
          <Display36>{t('thankYou')}</Display36>
        </Submitted>
      </SheetModal>
    );
  }

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <Wrapper>
          <Heading24>{t('question')}</Heading24>
          <Spacer16 />
          <Votes>
            <TouchableOpacity onPress={thumbsUpPress}>
              <Vote selected={answer === true}>{'👍'}</Vote>
            </TouchableOpacity>
            <Spacer16 />
            <TouchableOpacity onPress={thumbsDownPress}>
              <Vote selected={answer === false}>{'👎'}</Vote>
            </TouchableOpacity>
          </Votes>
          <Spacer96 />

          <Heading16>{t('comments')}</Heading16>
          <Spacer8 />
          <TextField
            multiline
            onChangeText={setComment}
            placeholder={t('commentsPlaceholder')}
            numberOfLines={3}
          />

          <Spacer16 />
          <Button onPress={submit}>{t('submit')}</Button>
          <Spacer24 />
        </Wrapper>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SessionFeedbackModal;