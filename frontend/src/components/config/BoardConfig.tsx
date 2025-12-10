import { useState, Dispatch, SetStateAction } from 'react';
import { DifficultyLevel } from '../../common/types';
import { CenteredLabel, CustomInput } from '../Fields';
import { LabeledCheckboxContainer } from './components/LabeledCheckbox';
import { ButtonCustom } from '../Button';
import PerCategoryPromotionModal from './PerCategoryPromotionModal';
import DifficultyPoints from './components/DifficultyPoints';
import theme from '../../common/theme';
import ToggleSwitch from '../ToggleSwitch';

export type BoardSettings = {
  totalDurationMinutes: number;
  endImmediatelyAfterTime: boolean;
  showLeaderboard: boolean;
  pointsPerDifficulty: Record<DifficultyLevel, number>;
  rankingPromotionRules: Record<string, number>;
  numberOfTiles: number;
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
          color: theme.palette.main.info_text,
          textShadow: 'none',
        }}
      >
        Ustawienia planszówki
      </p>
      <LabeledCheckboxContainer>
              <CenteredLabel>Liczba pól na planszy</CenteredLabel>
              <CustomInput
                style={{ height: '35px' }}
                type="number"
                value={settings.numberOfTiles}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    numberOfTiles: Number.parseInt(e.target.value),
                  })
                }
              />
            </LabeledCheckboxContainer>
      <LabeledCheckboxContainer>
        <CenteredLabel htmlFor="setShowLeaderboard">
          Czy ranking uczniów powinien się wyświetlać
        </CenteredLabel>
        <ToggleSwitch
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
          Zasady awansu w kategorii
        </CenteredLabel>
        <ButtonCustom onClick={() => setIsCategoryModalOpen(true)} style={{ fontSize: '0.75em' }}>
          Edytuj
        </ButtonCustom>
      </LabeledCheckboxContainer>
    </div>
  );
}
