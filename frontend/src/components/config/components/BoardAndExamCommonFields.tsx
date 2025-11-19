import { LabeledCheckboxContainer } from './LabeledCheckbox';
import { CenteredLabel, CheckboxInput, CustomInput } from '../../Fields';
import { BoardSettings } from '../BoardConfig';
import { ExamSettings } from '../ExamConfig';
import ToggleSwitch from '../../ToggleSwitch';
import theme from '../../../common/theme';

interface Props {
  settings: BoardSettings | ExamSettings;
  setSettings: any;
}

export default function BoardAndExamCommonFields({ settings, setSettings }: Props) {
  return (
    <>
      <LabeledCheckboxContainer>
        <CenteredLabel>Czas trwania gry {'(min)'}</CenteredLabel>
        <CustomInput
          style={{ height: '35px' }}
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
          Koniec gry po upływie czasu
        </CenteredLabel>
        <ToggleSwitch
          checked={settings.endImmediatelyAfterTime}
          onChange={(e) => setSettings({ ...settings, endImmediatelyAfterTime: e.target.checked })}
        />
      </LabeledCheckboxContainer>
    </>
  );
}
