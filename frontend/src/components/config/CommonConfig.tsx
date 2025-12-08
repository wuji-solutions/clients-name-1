import { CenteredLabel, CustomInput } from '../Fields';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom, InfoButton } from '../Button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export interface CommonSettings {
  questionDurationSeconds: number;
  questionFilePath: string;
}

interface Props {
  readonly commonSettings: CommonSettings;
  readonly setCommonSettings: Dispatch<SetStateAction<CommonSettings>>;
  readonly categoryCount: number;
  readonly questionCount: number;
}

const increaseWifiPeerSize = async (setRefreshTrigger: Function, peerSize: number) => {
  try {
    const res = await window.electronAPI.setWifiMaxPeers(peerSize);
    if (res.success) {
      window.alert('Zmiana liczby graczy powiodła się.');
    } else {
      const textContent = 'Failed: ' + (res.error || 'unknown');
      console.log(textContent);
    }
  } catch (err) {
    const textContent = 'Error: ' + String(err);
    console.log(textContent);
  } finally {
    setRefreshTrigger((prev: boolean) => !prev);
  }
};

export default function CommonConfig({
  commonSettings,
  setCommonSettings,
  categoryCount,
  questionCount,
}: Props) {
  const [fileName, setFileName] = useState<string>();
  const [peerSize, setPeerSize] = useState<number | null>(null);
  const [newPeerSize, setNewPeerSize] = useState<number | ''>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const getWifiPeerSize = async () => {
    const res = await window.electronAPI.getLimit();
    setPeerSize(res.success ? res.value : undefined);
    setNewPeerSize(res.success ? res.value : 0);
  };

  useEffect(() => {
    getWifiPeerSize();
  }, [refreshTrigger]);

  const openFilePicker = async () => {
    const fileName = await window.electronAPI.openFile();
    if (fileName) {
      setCommonSettings({ ...commonSettings, questionFilePath: fileName });
      const prettyFileName = fileName.split('\\');
      setFileName(prettyFileName[prettyFileName.length - 1]);
    }
  };
  return (
    <div
      style={{
        padding: '10px',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        marginBottom: '50px',
      }}
    >
      <LabeledCheckboxContainer style={{ position: 'relative' }}>
        {peerSize && (
          <>
            <CenteredLabel>
              Maksymalna liczba graczy
              <InfoButton
                tooltip="Ilość graczy która może brać udział w rozgrywce jest związana z ustawieniami systemu.
              Po wybraniu przycisku 'Zmień' system może poprosić o zezwolenie na zmianę, należy wtedy wybrać opcję 'Tak'
              "
              />
            </CenteredLabel>
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '20px',
              }}
            >
              <CustomInput
                style={{ height: '30px', width: '75px' }}
                type="number"
                value={newPeerSize}
                onChange={(e) => setNewPeerSize( e.target.value ? Math.min(parseInt(e.target.value), 120) : '')}
              />
            </div>
            <ButtonCustom
              onClick={() => increaseWifiPeerSize(setRefreshTrigger, newPeerSize != '' ? newPeerSize : 8)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: '90px',
                fontSize: '0.75em',
              }}
              disabled={newPeerSize == peerSize}
              title={
                newPeerSize == peerSize ? 'Nowa ilość graczy musi różnić się od poprzedniej' : ''
              }
            >
              Zmień
            </ButtonCustom>
          </>
        )}
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer style={{ position: 'relative' }}>
        <CenteredLabel>Wybierz plik z pytaniami</CenteredLabel>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            top: '40px',
            left: '20px',
          }}
        >
          <div>Wybrane: {fileName ? fileName : 'brak'}</div>
          {<div>Ilość pytań: {questionCount ? questionCount : 'brak'}</div>}
          {<div>Ilość kategorii: {categoryCount ? categoryCount : 'brak'}</div>}
        </div>
        <ButtonCustom
          onClick={openFilePicker}
          style={{ position: 'relative', overflow: 'hidden', width: '90px', fontSize: '0.75em' }}
        >
          Wybierz
        </ButtonCustom>
      </LabeledCheckboxContainer>
    </div>
  );
}
