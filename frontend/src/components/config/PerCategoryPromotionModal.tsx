import { ButtonCustom } from '../Button';
import Divider from '../Divider';
import { CenteredLabel } from '../Fields';
import Modal from '../Modal';
import { CleanInput } from './components/ConfigInput';
import { BoardSettings } from './BoardConfig';

interface Props {
  setIsCategoryModalOpen: any;
  isError: boolean;
  categoryList: string[];
  settings: BoardSettings;
  setSettings: any;
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
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <div style={{ height: '40%' }}>
          {isError ? (
            <h1>Upewnij się, że plik z pytaniami jest poprawny</h1>
          ) : (
            <>
              <h1>Lista kategorii</h1>
              <Divider></Divider>
              <div style={{ margin: '25px' }}></div>
              {categoryList.length === 0 && <h2>Brak dostępnych kategorii</h2>}
              {categoryList.map((categoryName) => {
                return (
                  <div
                    key={`nazwa_konfiguracji_${categoryName}`}
                    style={{ display: 'flex', margin: '10px' }}
                  >
                    <CenteredLabel>{categoryName}</CenteredLabel>
                    <CleanInput
                      type="number"
                      style={{ width: '30%', margin: 0 }}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          rankingPromotionRules: {
                            ...settings.rankingPromotionRules,
                            categoryName: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    >
                      Usuń
                    </CleanInput>
                  </div>
                );
              })}
              <div style={{ margin: '25px' }}></div>
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
