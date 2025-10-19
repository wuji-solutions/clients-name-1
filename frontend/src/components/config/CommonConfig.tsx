import { CenteredLabel } from '../Fields';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom } from '../Button';
import { CleanInput } from './components/ConfigInput';
import { Dispatch, SetStateAction } from 'react';

export interface CommonSettings {
  questionDurationSeconds: number;
  questionFilePath: string;
}

interface Props {
  readonly commonSettings: CommonSettings;
  readonly setCommonSettings: Dispatch<SetStateAction<CommonSettings>>;
}

export default function CommonConfig({ commonSettings, setCommonSettings }: Props) {
  const openFilePicker = async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
      setCommonSettings({ ...commonSettings, questionFilePath: filePath });
    }
  };
  return (
    <div>
      <p className="centered" style={{ fontSize: '2em' }}>
        Wspólne ustawienia
      </p>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEndImmediatelyAfterTime">Wybierz plik z pytaniami</CenteredLabel>
        <ButtonCustom
          onClick={openFilePicker}
          style={{ position: 'relative', overflow: 'hidden', width: '150px', fontSize: '0.75em' }}
        >
          Wybierz
        </ButtonCustom>
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Podaj czas na odpowiedź na jedno pytanie w sekundach</CenteredLabel>

        <CleanInput
          type="number"
          value={commonSettings.questionDurationSeconds}
          onChange={(e) =>
            setCommonSettings({
              ...commonSettings,
              questionDurationSeconds: Number.parseInt(e.target.value),
            })
          }
        />
      </LabeledCheckboxContainer>
    </div>
  );
}
