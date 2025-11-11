import { useEffect, useState } from 'react';
import { mode } from '../../common/types';
import { getConfigNamesByMode, deleteConfig, loadConfig } from '../../service/configService';
import { ButtonCustom } from '../Button';
import Modal from '../Modal';
import { CenteredLabel } from '../Fields';
import Divider from '../Divider';
import { useError } from '../../providers/ErrorProvider';
import theme from '../../common/theme';

interface Props {
  readonly mode: mode;
  readonly setIsEditDialogOpen: any;
  readonly setConfig: any;
}

const modeToString = (mode: mode): string => {
  switch (mode) {
    case 'quiz':
      return 'quizu';
    case 'board':
      return 'planszówki';
    case 'exam':
      return 'sprawdzianu';
  }
};

export default function ManageConfig({ mode, setIsEditDialogOpen, setConfig }: Props) {
  const [configList, setConfigList] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<boolean>(true);
  const { setError } = useError();

  useEffect(() => {
    getConfigNamesByMode(mode)
      .then((configs) => {
        setConfigList(configs.data);
        setIsError(false);
      })
      .catch((error) =>
        setError(
          'Wystąpił błąd podczas pobierania listy konfiguracji\n' + error.response.data.message
        )
      );
  }, [mode, refreshKey]);

  const removeConfig = (configName: string) => {
    deleteConfig(mode, configName);
    setRefreshKey((prev) => !prev);
  };

  const selectConfig = (configName: string) => {
    loadConfig(mode, configName).then((res) => setConfig(res.data));
    setIsEditDialogOpen(false);
  };

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
              Nie udało się pobrać listy konfiguracji
            </h1>
          ) : (
            <>
              <h1 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
                Lista dostępnych konfiguracji dla {modeToString(mode)}
              </h1>
              <Divider></Divider>
              {configList.length === 0 && <h2>Brak zapisanych konfiguracji</h2>}
              {configList.map((configName) => {
                return (
                  <div
                    key={`konfiguracja_${configName}`}
                    style={{
                      display: 'flex',
                      margin: '10px',
                      color: theme.palette.main.info_text,
                      textShadow: 'none',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CenteredLabel style={{ fontSize: '22px' }}>{configName}</CenteredLabel>
                    <div style={{ width: '60%', display: 'flex', gap: '20px' }}>
                      <ButtonCustom
                        style={{ width: '30%', margin: '0 0 0 auto' }}
                        onClick={() => selectConfig(configName)}
                      >
                        Wczytaj
                      </ButtonCustom>
                      <ButtonCustom
                        style={{ width: '30%', margin: 0 }}
                        onClick={() => removeConfig(configName)}
                        color={theme.palette.main.error}
                      >
                        Usuń
                      </ButtonCustom>
                    </div>
                  </div>
                );
              })}
              <Divider></Divider>
            </>
          )}

          <ButtonCustom style={{ marginTop: '20px' }} onClick={() => setIsEditDialogOpen(false)}>
            Wyjdź
          </ButtonCustom>
        </div>
      </div>
    </Modal>
  );
}
