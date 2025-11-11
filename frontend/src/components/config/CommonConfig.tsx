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
}

export default function CommonConfig({ commonSettings, setCommonSettings }: Props) {
  const [filePath, setFilePath] = useState<string>();
  const openFilePicker = async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
      setCommonSettings({ ...commonSettings, questionFilePath: filePath });
      const prettyFilePath = filePath.split('\\');
      setFilePath(prettyFilePath[prettyFilePath.length-1]);
    }
  };
  return (
    <div style={{padding: '10px', display: 'flex', gap: '10px', flexDirection: 'column'}}>
      <LabeledCheckboxContainer style={{position: 'relative'}}>
        <CenteredLabel>Wybierz plik z pytaniami</CenteredLabel>
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '20px',
        }}>
          Wybrane: {filePath ? filePath : 'brak'}
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
          style={{height: '35px'}}
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
