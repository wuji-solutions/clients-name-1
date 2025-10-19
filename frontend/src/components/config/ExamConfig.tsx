import { useState, Dispatch, SetStateAction } from 'react';
import { DifficultyLevel, Question } from '../../common/types';
import { CenteredLabel, CheckboxInput } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import './config-styles.css';
import { CleanInput } from './components/ConfigInput';
import DifficultyPoints from './components/DifficultyPoints';
import OtherStuff from './components/BoardAndExamCommonFields';
import EnableQuestionConfig from './EnableQuestionConfig';
import { ButtonCustom } from '../Button';

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
    <>
      <p className="centered" style={{ fontSize: '2em' }}>
        Ustawienia sprawdzianu
      </p>
      <OtherStuff settings={settings} setSettings={setSettings} />
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
          value={settings.requiredQuestionCount}
          onChange={(e) =>
            setSettings({ ...settings, requiredQuestionCount: Number(e.target.value) })
          }
        />
      </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel>
          Liczba dodatkowych sekund na odpowiedź przy zakończeniu sprawdzianu
        </CenteredLabel>
        <CleanInput
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
        <CenteredLabel>Wybierz pytania które mają zostać użyte</CenteredLabel>
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
    </>
  );
}
