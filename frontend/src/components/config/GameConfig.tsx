import { ConfigDTO, mode } from '../../common/types';
import CommonConfig, { CommonSettings } from './CommonConfig';
import QuizConfig from './QuizConfig';
import ExamConfig, { ExamSettings } from './ExamConfig';
import BoardConfig, { BoardSettings } from './BoardConfig';
import { ButtonCustom } from '../Button';
import Divider from '../Divider';
import { useState } from 'react';
import EditConfig from './EditConfig';
import { applySettingsFromDto } from './utils';

interface Props {
  mode: mode;
  commonSettings: CommonSettings;
  setCommonSettings: any;
  examSettings: ExamSettings;
  setExamSettings: any;
  boardSettings: BoardSettings;
  setBoardSettings: any;
}

export default function GameConfig({
  mode,
  commonSettings,
  setCommonSettings,
  examSettings,
  setExamSettings,
  boardSettings,
  setBoardSettings,
}: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const editConfig = () => {
    setIsEditDialogOpen(true);
  };

  const setConfig = (dto: ConfigDTO) => {
    applySettingsFromDto(dto, setCommonSettings, setExamSettings, setBoardSettings);
  };

  if (!isEditDialogOpen) {
  }
  return (
    <div
      style={{
        // there is a bug regarding height;
        // it is too tall (leaves empty space in the end)
        marginTop: 'auto',
        marginBottom: 'auto',
        display: 'flex',
        flexDirection: 'column',
        width: '95%',
      }}
    >
      {isEditDialogOpen && (
        <EditConfig setConfig={setConfig} mode={mode} setIsEditDialogOpen={setIsEditDialogOpen} />
      )}
      <h1 className="centered" style={{ fontSize: '300%' }}>
        Ustawienia
      </h1>
      <ButtonCustom style={{ width: '40%' }} onClick={editConfig}>
        Zarządzaj
      </ButtonCustom>
      <div
        style={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '25px',
        }}
      >
        <div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
          <Divider />

          <CommonConfig commonSettings={commonSettings} setCommonSettings={setCommonSettings} />
          <Divider />
          {mode === 'quiz' && <QuizConfig />}
          {mode === 'board' && (
            <BoardConfig settings={boardSettings} setSettings={setBoardSettings} />
          )}
          {mode === 'exam' && <ExamConfig settings={examSettings} setSettings={setExamSettings} />}
        </div>
      </div>

      <ButtonCustom style={{ width: '40%' }}>Zapisz</ButtonCustom>
    </div>
  );
}
