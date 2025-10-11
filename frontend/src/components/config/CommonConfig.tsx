import { CenteredLabel, CheckboxInput } from '../Fields';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom } from '../Button';
import { CleanInput } from './components/ConfigInput';
import { MAX_QUESTION_DURATION_LENGTH_SECONDS } from './constants';

export interface CommonSettings {
  questionDurationSeconds: number;
  questionFilePath: string;
}

interface Props {
  commonSettings: CommonSettings;
  setCommonSettings: React.Dispatch<React.SetStateAction<CommonSettings>>;
}

export default function CommonConfig({ commonSettings, setCommonSettings }: Props) {
  return (
    <div>
      <p className="centered" style={{ fontSize: '2em' }}>
        Wspólne ustawienia
      </p>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEndImmediatelyAfterTime">Wybierz plik z pytaniami</CenteredLabel>
        <ButtonCustom style={{ position: 'relative', overflow: 'hidden', width: '150px' }}>
          <span style={{ fontSize: '0.5em' }}>Wybierz</span>
          <input
            type="file"
            accept="application/xml,text/xml,.xml"
            onChange={(file) =>
              setCommonSettings({ ...commonSettings, questionFilePath: file.target.value })
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '150px',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </ButtonCustom>
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Podaj czas na odpowiedź na jedno pytanie w sekundach</CenteredLabel>

        <CleanInput
          type="number"
          max={MAX_QUESTION_DURATION_LENGTH_SECONDS}
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
