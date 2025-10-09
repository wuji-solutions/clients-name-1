import { useEffect, useState } from 'react';
import { mode } from '../../common/types';
import { getConfigNamesByMode, deleteConfig, loadConfig } from '../../service/configService';
import { ButtonCustom } from '../Button';
import Modal from '../Modal';

interface Props {
  mode: mode;
  setIsEditDialogOpen: any;
  setConfig: any;
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

export default function EditConfig({ mode, setIsEditDialogOpen, setConfig }: Props) {
  const [configList, setConfigList] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    getConfigNamesByMode(mode)
      .then((configs) => {
        setConfigList(configs.data);
        setIsError(false);
      })
      .catch(() => setIsError(true));
  }, [mode, refreshKey]);

  const removeConfig = (configName: string) => {
    deleteConfig(mode, configName);
    updateRefreshKey();
  };

  const selectConfig = (configName: string) => {
    loadConfig(mode, configName).then((res) => setConfig(res.data));
    setIsEditDialogOpen(false);
  };

  const updateRefreshKey = () => setRefreshKey(refreshKey + 1);

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
            <h1>Nie udało się pobrać listy konfiguracji</h1>
          ) : (
            <>
              <h1>Lista dostępnych konfiguracji dla {modeToString(mode)}</h1>
              {configList.map((configName, idx) => {
                return (
                  <div style={{ display: 'flex', margin: '10px' }}>
                    {configName}
                    <ButtonCustom onClick={() => selectConfig(configName)}>Wczytaj</ButtonCustom>
                    <ButtonCustom onClick={() => removeConfig(configName)}>Usuń</ButtonCustom>
                  </div>
                );
              })}
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
