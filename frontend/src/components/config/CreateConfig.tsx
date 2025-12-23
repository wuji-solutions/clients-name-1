import { useState } from 'react';
import { ConfigDTO, mode } from '../../common/types';
import { createConfig } from '../../service/configService';
import { CenteredLabel, CustomInput } from '../Fields';
import Modal from '../Modal';
import { ButtonCustom } from '../Button';
import { useError } from '../../providers/ErrorProvider';
import theme from '../../common/theme';

interface Props {
  readonly mode: mode;
  readonly config: ConfigDTO;
  readonly setIsOpen: any;
}

export default function CreateConfig({ mode, config, setIsOpen }: Props) {
  const [configName, setConfigName] = useState<string>('');
  const { setError } = useError();

  const create = () => {
    createConfig(mode, configName, config).catch((error) =>
      setError('Wystąpił błąd podczas zapisywania konfiguracij:\n' + error.response.data.message)
    );
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
          height: '90vh',
          textAlign: 'center',
        }}
      >
        <div style={{ height: '40%' }}>
          <CenteredLabel style={{color: theme.palette.main.info_text}}>Wprowadź nazwę konfiguracji</CenteredLabel>

          <CustomInput
            type="text"
            value={configName}
            style={{ paddingRight: 0, width: '350px' }}
            onChange={(e) => setConfigName(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px', gap: '30px' }}>
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
