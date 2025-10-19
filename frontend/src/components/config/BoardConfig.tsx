import { useState, Dispatch, SetStateAction } from 'react';
import { DifficultyLevel } from '../../common/types';
import { CenteredLabel, CheckboxInput } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom } from '../Button';
import PerCategoryPromotionModal from './PerCategoryPromotionModal';
import DifficultyPoints from './components/DifficultyPoints';
import OtherStuff from './components/BoardAndExamCommonFields';

export type BoardSettings = {
  totalDurationMinutes: number;
  endImmediatelyAfterTime: boolean;
  showLeaderboard: boolean;
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  rankingPromotionRules: Record<string, number>;
};

interface Props {
  readonly settings: BoardSettings;
  readonly setSettings: Dispatch<SetStateAction<BoardSettings>>;
  readonly categoryNames: string[];
  readonly parseError: boolean;
}

export default function BoardConfig({ settings, setSettings, categoryNames, parseError }: Props) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  return (
    <>
      <p className="centered" style={{ fontSize: '2em' }}>
        Ustawienia planszówki
      </p>
      <OtherStuff settings={settings} setSettings={setSettings} />
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
      <DifficultyPoints settings={settings} setSettings={setSettings} />
      {isCategoryModalOpen && (
        <PerCategoryPromotionModal
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          isError={parseError}
          categoryList={categoryNames}
          settings={settings}
          setSettings={setSettings}
        />
      )}
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setEndImmediatelyAfterTime">
          Liczba poprawnych odpowiedzi potrzebnych do awansu w danej kategorii
        </CenteredLabel>
        <ButtonCustom onClick={() => setIsCategoryModalOpen(true)} style={{ fontSize: '0.75em' }}>
          Edytuj
        </ButtonCustom>
      </LabeledCheckboxContainer>
    </>
  );
}
