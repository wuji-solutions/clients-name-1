import React from 'react';
import { DifficultyLevel } from '../../common/types';
import { CenteredLabel, CustomInput, CustomInputFullWidth } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import Dropdown from '../Dropdown';

export type BoardSettings = {
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  rankingPromotionRules: Record<string, number>;
};

interface Props {
  settings: BoardSettings;
  setSettings: React.Dispatch<React.SetStateAction<BoardSettings>>;
}

export default function BoardConfig({ settings, setSettings }: Props) {
  return (
    <>
      <p className="centered" style={{ fontSize: '2em' }}>
        Ustawienia planszówki
      </p>
      {/* TOOD: currently there is one setting missing */}
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
