import React from 'react';
import { DifficultyLevel } from '../../common/types';
import { CenteredLabel, CheckboxInput } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import Dropdown from '../Dropdown';
import { CleanInput } from './components/ConfigInput';

export type BoardSettings = {
  totalDurationMinutes: number;
  endImmediatelyAfterTime: boolean;
  showLeaderboard: boolean;
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  rankingPromotionRules: Record<string, number>;
};

interface Props {
  readonly settings: BoardSettings;
  readonly setSettings: React.Dispatch<React.SetStateAction<BoardSettings>>;
}

export default function BoardConfig({ settings, setSettings }: Props) {
  return (
    <>
      <p className="centered" style={{ fontSize: '2em' }}>
        Ustawienia planszówki
      </p>
      {/* TOOD: currently there is one setting missing */}
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
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setShowLeaderboard">
          Czy ranking uczniów powinien się wyświetlać
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          id="setShowLeaderboard"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.showLeaderboard}
          onChange={(e) => setSettings({ ...settings, showLeaderboard: e.target.checked })}
        />
      </LabeledCheckboxContainer>
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
