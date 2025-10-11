import { CenteredLabel, CheckboxInput } from '../Fields';
import './config-styles.css';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';

export interface CommonSettings {
  endImmediatelyAfterTime: boolean;
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
    </div>
  );
}
