import { CenteredLabel, CustomInput } from '../Fields';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom } from '../Button';
import { Dispatch, SetStateAction, useState } from 'react';

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

export default function CommonConfig({
  commonSettings,
  setCommonSettings,
  categoryCount,
  questionCount,
}: Props) {
  const [fileName, setFileName] = useState<string>();
  const openFilePicker = async () => {
    const fileName = await window.electronAPI.openFile();
    if (fileName) {
      setCommonSettings({ ...commonSettings, questionFilePath: fileName });
      const prettyFileName = fileName.split('\\');
      setFileName(prettyFileName[prettyFileName.length - 1]);
    }
  };
  return (
    <div style={{ padding: '10px', display: 'flex', gap: '40px', flexDirection: 'column' }}>
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
      <LabeledCheckboxContainer>
        <CenteredLabel>Czas na odpowiedź na pytanie {'(s)'}</CenteredLabel>

        <CustomInput
          style={{ height: '35px' }}
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
