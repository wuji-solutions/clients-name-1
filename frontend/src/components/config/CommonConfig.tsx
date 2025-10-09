import { CenteredLabel, CheckboxInput, CustomInput, CustomInputFullWidth } from '../Fields';
import { MAX_GAME_LENGTH, MAX_QUESTION_DURATION_LENGTH_SECONDS } from './constants';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { CleanInput } from './components/ConfigInput';

export interface CommonSettings {
  totalDurationMinutes: number;
  endImmediatelyAfterTime: boolean;
  questionFilePath: string;
  questionDurationSeconds: number;
}

interface Props {
  commonSettings: CommonSettings;
  setCommonSettings: React.Dispatch<React.SetStateAction<CommonSettings>>;
}

export default function CommonConfig({ commonSettings, setCommonSettings }: Props) {
  return (
    <div>
      <p className="centered" style={{ fontSize: '200%' }}>
        Wspólne ustawienia
      </p>
      <LabeledCheckboxContainer>
        <CenteredLabel>Podaj łączny czas trwania gry w minutach</CenteredLabel>
        <CleanInput
          type="number"
          max={MAX_GAME_LENGTH}
          value={commonSettings.totalDurationMinutes}
          onChange={(e) =>
            setCommonSettings({ ...commonSettings, totalDurationMinutes: parseInt(e.target.value) })
          }
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEndImmediatelyAfterTime">
          Czy gra ma skończyć się automatycznie po upływie czasu
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          id="setEndImmediatelyAfterTime"
          style={{ width: '3rem', margin: 0 }}
          checked={commonSettings.endImmediatelyAfterTime}
          onChange={(e) =>
            setCommonSettings({ ...commonSettings, endImmediatelyAfterTime: e.target.checked })
          }
        />
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
              questionDurationSeconds: parseInt(e.target.value),
            })
          }
        />
      </LabeledCheckboxContainer>
    </div>
  );
}
