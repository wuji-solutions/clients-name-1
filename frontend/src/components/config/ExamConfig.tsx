import { useState, Dispatch, SetStateAction } from 'react';
import { DifficultyLevel, Question } from '../../common/types';
import { CenteredLabel, CustomInput } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import './config-styles.css';
import DifficultyPoints from './components/DifficultyPoints';
import OtherStuff from './components/BoardAndExamCommonFields';
import EnableQuestionConfig from './EnableQuestionConfig';
import { ButtonCustom } from '../Button';
import { lightenColor } from '../../common/utils';
import theme from '../../common/theme';
import ToggleSwitch from '../ToggleSwitch';

export type ExamSettings = {
  totalDurationMinutes: number;
  endImmediatelyAfterTime: boolean;
  requiredQuestionCount: number;
  randomizeQuestions: boolean;
  enforceDifficultyBalance: boolean;
  selectedQuestionIds: number[];
  zeroPointsOnCheating: boolean;
  markQuestionOnCheating: boolean;
  notifyTeacherOnCheating: boolean;
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  allowGoingBack: boolean;
  showDetailedFinishFeedback: boolean;
  additionalTimeToAnswerAfterFinishInSeconds: number;
};

interface ExamConfigProps {
  readonly settings: ExamSettings;
  readonly setSettings: Dispatch<SetStateAction<ExamSettings>>;
  readonly questionListError: boolean;
  readonly questionList: Question[];
}

export default function ExamConfig({
  settings,
  setSettings,
  questionList,
  questionListError,
}: ExamConfigProps) {
  const [isQuestionIdSelectorOpen, setIsQuestionIdSelectorOpen] = useState<boolean>(false);
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
      }}
    >
      <p
        className="centered"
        style={{
          fontSize: '2em',
          color: lightenColor(theme.palette.main.accent, 0.1),
          textShadow: 'none',
        }}
      >
        Ustawienia sprawdzianu
      </p>
      <OtherStuff settings={settings} setSettings={setSettings} />
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Czy losowane pytania powinny być równomiernie rozłożone według trudności
        </CenteredLabel>
        <ToggleSwitch
          checked={settings.enforceDifficultyBalance}
          onChange={(e) => setSettings({ ...settings, enforceDifficultyBalance: e.target.checked })}
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Zerowanie punktów w przypadku oszustwa
        </CenteredLabel>

        <ToggleSwitch
          checked={settings.zeroPointsOnCheating}
          onChange={(e) => setSettings({ ...settings, zeroPointsOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>

      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Oznaczenie odpowiedzi przy wykryciu ściągania
        </CenteredLabel>
        <ToggleSwitch
          checked={settings.markQuestionOnCheating}
          onChange={(e) => setSettings({ ...settings, markQuestionOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Powiadomienie o próbie ściągania
        </CenteredLabel>
        <ToggleSwitch
          checked={settings.notifyTeacherOnCheating}
          onChange={(e) => setSettings({ ...settings, notifyTeacherOnCheating: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEnforceDifficultyBalance">
          Zezwolić na powrót do poprzednich pytań
        </CenteredLabel>
        <ToggleSwitch
          checked={settings.allowGoingBack}
          onChange={(e) => setSettings({ ...settings, allowGoingBack: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Szczegóły pytań w wynikach sprawdzianu</CenteredLabel>
        <ToggleSwitch
          checked={settings.showDetailedFinishFeedback}
          onChange={(e) =>
            setSettings({ ...settings, showDetailedFinishFeedback: e.target.checked })
          }
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Czy pytania mają być losowane z dostępnej puli</CenteredLabel>
        <ToggleSwitch
          checked={settings.randomizeQuestions}
          onChange={(e) => setSettings({ ...settings, randomizeQuestions: e.target.checked })}
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Liczba pytań, na które musi odpowiedzieć uczeń</CenteredLabel>
        <CustomInput
          style={{ height: '35px' }}
          type="number"
          value={settings.requiredQuestionCount}
          onChange={(e) =>
            setSettings({ ...settings, requiredQuestionCount: Number(e.target.value) })
          }
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Czas na odpowiedź po zakończeniu {'(s)'}</CenteredLabel>
        <CustomInput
          style={{ height: '35px' }}
          type="number"
          value={settings.additionalTimeToAnswerAfterFinishInSeconds}
          onChange={(e) =>
            setSettings({
              ...settings,
              additionalTimeToAnswerAfterFinishInSeconds: Number(e.target.value),
            })
          }
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>Użyte pytania</CenteredLabel>
        <ButtonCustom
          style={{ fontSize: '0.75em' }}
          onClick={(e) => setIsQuestionIdSelectorOpen(true)}
        >
          Wybierz
        </ButtonCustom>
        {isQuestionIdSelectorOpen && (
          <EnableQuestionConfig
            settings={settings}
            setSettings={setSettings}
            setIsOpen={setIsQuestionIdSelectorOpen}
            isError={questionListError}
            questionList={questionList}
          />
        )}
      </LabeledCheckboxContainer>

      <DifficultyPoints settings={settings} setSettings={setSettings} />
    </div>
  );
}
