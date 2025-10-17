import { LabeledCheckboxContainer } from './LabeledCheckbox';
import { CenteredLabel, CheckboxInput } from '../../Fields';
import { CleanInput } from './ConfigInput';
import { BoardSettings } from '../BoardConfig';
import { ExamSettings } from '../ExamConfig';

interface Props {
  settings: BoardSettings | ExamSettings;
  setSettings: any;
}

export default function BoardAndExamCommonFields({ settings, setSettings }: Props) {
  return (
    <>
      <LabeledCheckboxContainer>
        <CenteredLabel>Podaj łączny czas trwania gry w minutach</CenteredLabel>
        <CleanInput
          type="number"
          value={settings.totalDurationMinutes}
          onChange={(e) =>
            setSettings({
              ...settings,
              totalDurationMinutes: Number.parseInt(e.target.value),
            })
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
          checked={settings.endImmediatelyAfterTime}
          onChange={(e) => setSettings({ ...settings, endImmediatelyAfterTime: e.target.checked })}
        />
      </LabeledCheckboxContainer>
    </>
  );
}
