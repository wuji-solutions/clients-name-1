import Dropdown from '../../Dropdown';
import { CenteredLabel } from '../../Fields';
import { LabeledCheckboxContainer } from './LabeledCheckbox';
import { BoardSettings } from '../BoardConfig';
import { ExamSettings } from '../ExamConfig';

interface Props {
  settings: BoardSettings | ExamSettings;
  setSettings: any;
}

export default function DifficultyPoints({ settings, setSettings }: Props) {
  return (
    <>
      <LabeledCheckboxContainer>
        <CenteredLabel>Ilość punktów za pytanie łatwe</CenteredLabel>
        <Dropdown
          options={['1', '2', '3']}
          selectedValue={String(settings.pointsPerDifficulty.EASY)}
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                EASY: Number.parseInt(e),
              },
            })
          }
          placeholder="1"
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Ilość punktów za pytanie średnie</CenteredLabel>
        <Dropdown
          options={['1', '2', '3']}
          selectedValue={String(settings.pointsPerDifficulty.MEDIUM)}
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                MEDIUM: Number.parseInt(e),
              },
            })
          }
          placeholder="2"
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Ilość punktów za pytanie trudne</CenteredLabel>
        <Dropdown
          options={['1', '2', '3']}
          selectedValue={String(settings.pointsPerDifficulty.HARD)}
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                HARD: Number.parseInt(e),
              },
            })
          }
          placeholder="3"
        />
      </LabeledCheckboxContainer>
    </>
  );
}
