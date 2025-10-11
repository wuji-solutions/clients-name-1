import React, { useState } from 'react';
import { ConfigDTO, mode } from '../../common/types';
import { createConfig } from '../../service/configService';
import { CenteredLabel, CustomInputFullWidth } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import Modal from '../Modal';
import { CleanInput } from './components/ConfigInput';
import { ButtonCustom } from '../Button';

interface Props {
  mode: mode;
  config: ConfigDTO;
  setIsOpen: any;
}

export default function CreateConfig({ mode, config, setIsOpen }: Props) {
  const [configName, setConfigName] = useState<string>('');
  const create = () => {
    createConfig(mode, configName, config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setIsOpen(false);
  };

  const close = () => setIsOpen(false);

  return (
    <Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <div style={{ height: '40%' }}>
          <CenteredLabel>Wprowadź nazwę konfiguracji</CenteredLabel>

          <CleanInput
            type="text"
            value={configName}
            style={{ paddingRight: 0 }}
            onChange={(e) => setConfigName(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '10px' }}>
            <ButtonCustom style={{ width: '45%' }} onClick={close}>
              Wróć
            </ButtonCustom>
            <ButtonCustom style={{ width: '45%' }} onClick={create}>
              Zapisz
            </ButtonCustom>
          </div>
        </div>
      </div>
    </Modal>
  );
}
