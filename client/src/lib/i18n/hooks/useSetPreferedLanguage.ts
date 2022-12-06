import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {
  CLIENT_LANGUAGE_TAGS,
  LANGUAGES,
  LANGUAGE_TAG,
} from '../../../../../shared/src/constants/i18n';
import useAppState from '../../appState/state/state';

const useSetPreferredLanguage = () => {
  const {t} = useTranslation('Screen.Profile');
  const setSettings = useAppState(state => state.setSettings);

  return useCallback(
    (languageTag: LANGUAGE_TAG) => {
      if (CLIENT_LANGUAGE_TAGS.includes(languageTag)) {
        setSettings({preferredLanguage: languageTag});
      } else {
        const language = LANGUAGES[languageTag];
        Alert.alert(
          t('unsupportedLanguage.title'),
          t('unsupportedLanguage.message', {language}),
          [
            {
              text: t('unsupportedLanguage.confirm'),
              onPress: () => setSettings({preferredLanguage: languageTag}),
            },
            {text: t('unsupportedLanguage.dismiss'), style: 'cancel'},
          ],
        );
      }
    },
    [setSettings, t],
  );
};

export default useSetPreferredLanguage;