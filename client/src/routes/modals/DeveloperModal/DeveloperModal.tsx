import React from 'react';
import {useTranslation} from 'react-i18next';

import ActionList from '../../../lib/components/ActionList/ActionList';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import {useUiLib} from '../../../lib/uiLib/hooks/useUiLib';
import useToggleHiddenContent from '../../../lib/i18n/hooks/useToggleHiddenContent';
import useAppState from '../../../lib/appState/state/state';
import useClearUpdates from '../../../lib/codePush/hooks/useClearUpdates';
import useCheckForUpdate from '../../../lib/codePush/hooks/useCheckForUpdate';
import ActionSwitch from '../../../lib/components/ActionList/ActionItems/ActionSwitch';
import useAddDevUserEvents from './hooks/useAddDevUserEvents';

const DeveloperModal = () => {
  const {t} = useTranslation('Modal.Developer');
  const {toggle: toggleUiLib} = useUiLib();
  const toggleHiddenContent = useToggleHiddenContent();
  const showHiddenContent = useAppState(
    state => state.settings.showHiddenContent,
  );
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  const addDevUserEvents = useAddDevUserEvents();

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          <ActionButton onPress={toggleUiLib}>{t('uiLib')}</ActionButton>
          <ActionSwitch
            onValueChange={toggleHiddenContent}
            value={showHiddenContent}>
            {t('showHiddenContent')}
          </ActionSwitch>
        </ActionList>
        <Spacer8 />
        <ActionList>
          <ActionButton onPress={clearUpdates}>{t('clearUpdate')}</ActionButton>
          <ActionButton onPress={checkForUpdate}>
            {t('checkUpdate')}
          </ActionButton>
        </ActionList>
        <Spacer16 />

        <ActionList>
          <ActionButton onPress={addDevUserEvents}>
            {t('addDevUserEvents')}
          </ActionButton>
        </ActionList>
      </Gutters>
    </SheetModal>
  );
};

export default DeveloperModal;
