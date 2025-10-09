import React from 'react';
import { DifficultyLevel } from '../../common/types';
import { CenteredLabel, CheckboxInput, CustomInput, CustomInputFullWidth } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import './config-styles.css';
import Dropdown from '../Dropdown';
import { CleanInput } from './components/ConfigInput';

export type ExamSettings = {
  requiredQuestionCount: number;
  randomizeQuestions: boolean;
  enforceDifficultyBalance: boolean;
  selectedQuestionIds: number[];
  zeroPointsOnCheating: boolean;
  markQuestionOnCheating: boolean;
  notifyTeacherOnCheating: boolean;
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  allowGoingBack: boolean;
};

interface ExamConfigProps {
  settings: ExamSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExamSettings>>;
}

export default function ExamConfig({ settings, setSettings }: ExamConfigProps) {
  return (
    <>
      <p className="centered" style={{ fontSize: '200%' }}>
        Ustawienia sprawdzianu
      </p>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setRandomizeQuestions">
          Czy gra ma skończyć się automatycznie po upływie czasu
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.randomizeQuestions}
          onChange={(e) => setSettings({ ...settings, randomizeQuestions: e.target.checked })}
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy losowane pytania powinny być równomiernie rozłożone według trudności
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.enforceDifficultyBalance}
          onChange={(e) => setSettings({ ...settings, enforceDifficultyBalance: e.target.checked })}
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy uczeń otrzymuje 0 punktów za próbę ściągania
        </CenteredLabel>

        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.zeroPointsOnCheating}
          onChange={(e) => setSettings({ ...settings, zeroPointsOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy oznaczyć pytanie jako podejrzane przy wykryciu ściągania
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.markQuestionOnCheating}
          onChange={(e) => setSettings({ ...settings, markQuestionOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy powiadomić nauczyciela o próbie ściągania
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.notifyTeacherOnCheating}
          onChange={(e) => setSettings({ ...settings, notifyTeacherOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy uczeń może wracać do poprzednich pytań
        </CenteredLabel>
        <CheckboxInput
          type="checkbox"
          style={{ width: '3rem', margin: 0 }}
          checked={settings.allowGoingBack}
          onChange={(e) => setSettings({ ...settings, allowGoingBack: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Liczba pytań, na które musi odpowiedzieć uczeń</CenteredLabel>
        <CleanInput
          type="number"
          onChange={(e) =>
            setSettings({ ...settings, requiredQuestionCount: Number(e.target.value) })
          }
        />
      </LabeledCheckboxContainer>
      {/* <LabeledCheckboxContainer>
        <CenteredLabel>Lista ID pytań wybranych ręcznie (oddzielone przecinkami)</CenteredLabel>
        <CleanInput
          type="text"
          value={settings.selectedQuestionIds.join(',')}
          onChange={(e) =>
            setSettings({
              ...settings,
              selectedQuestionIds: e.target.value
                .split(',')
                .map((id) => Number(id.trim()))
                .filter((id) => !isNaN(id)),
            })
          }
        />
      </LabeledCheckboxContainer> */}
      <LabeledCheckboxContainer>
        <CenteredLabel>Ilość punktów za pytanie łatwe</CenteredLabel>
        <Dropdown
          options={['1', '2', '3']}
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                EASY: Number(e),
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
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                MEDIUM: Number(e),
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
          onSelect={(e) =>
            setSettings({
              ...settings,
              pointsPerDifficulty: {
                ...settings.pointsPerDifficulty,
                HARD: Number(e),
              },
            })
          }
          placeholder="3"
        />
      </LabeledCheckboxContainer>
    </>
  );
}
