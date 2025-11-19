import { ButtonCustom } from '../Button';
import Divider from '../Divider';
import { CenteredLabel, CustomInput } from '../Fields';
import Modal from '../Modal';
import { CleanInput } from './components/ConfigInput';
import { BoardSettings } from './BoardConfig';
import theme from '../../common/theme';

interface Props {
  readonly setIsCategoryModalOpen: any;
  readonly isError: boolean;
  readonly categoryList: string[];
  readonly settings: BoardSettings;
  readonly setSettings: any;
}

export default function PerCategoryPromotionModal({
  setIsCategoryModalOpen,
  isError,
  categoryList,
  settings,
  setSettings,
}: Props) {
  return (
    <Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'space-evenly',
            height: '70%',
          }}
        >
          {isError ? (
            <h1 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
              Upewnij się, że plik z pytaniami jest poprawny
            </h1>
          ) : (
            <>
              <h1 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
                Lista kategorii
              </h1>
              <h3 style={{ color: theme.palette.main.info_text, textShadow: 'none', width: '500px' }}>
                Określ ile punktów musi zdobyć uczeń aby awansować na kolejny poziom w danej kategorii
              </h3>
              <Divider></Divider>
              {categoryList.length === 0 && (
                <h2 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
                  Brak dostępnych kategorii
                </h2>
              )}
              {categoryList.map((categoryName) => {
                return (
                  <div
                    key={categoryName}
                    style={{
                      display: 'flex',
                      margin: '10px',
                      color: theme.palette.main.info_text,
                      textShadow: 'none',
                    }}
                  >
                    <CenteredLabel style={{ width: '70%', fontSize: '22px' }}>{categoryName}</CenteredLabel>
                    <CustomInput
                      type="number"
                      style={{ width: '20%', margin: 0, height: '40px' }}
                      value={settings.rankingPromotionRules[categoryName]}
                      placeholder="Wartość"
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          rankingPromotionRules: {
                            ...settings.rankingPromotionRules,
                            [categoryName]: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                );
              })}
              <Divider></Divider>
            </>
          )}

          <ButtonCustom style={{ marginTop: '20px' }} onClick={() => setIsCategoryModalOpen(false)}>
            Zakończ
          </ButtonCustom>
        </div>
      </div>
    </Modal>
  );
}
