import { ConfigDTO, mode, Question } from '../../common/types';
import CommonConfig, { CommonSettings } from './CommonConfig';
import QuizConfig from './QuizConfig';
import ExamConfig, { ExamSettings } from './ExamConfig';
import BoardConfig, { BoardSettings } from './BoardConfig';
import { ButtonCustom } from '../Button';
import Divider from '../Divider';
import { useEffect, useState } from 'react';
import EditConfig from './ManageConfig';
import { applySettingsFromDto, settingsToConfig } from './utils';
import CreateConfig from './CreateConfig';
import { service } from '../../service/service';
import { useError } from '../../providers/ErrorProvider';
import theme from '../../common/theme';

interface Props {
  readonly mode: mode;
  readonly commonSettings: CommonSettings;
  readonly setCommonSettings: any;
  readonly examSettings: ExamSettings;
  readonly setExamSettings: any;
  readonly boardSettings: BoardSettings;
  readonly setBoardSettings: any;
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
  const [isOpenSaveConfig, setIsOpenSaveConfig] = useState<boolean>(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [questionFileParseError, setQuestionFileParseError] = useState<boolean>(false);
  const { setError } = useError();
  const editConfig = () => {
    setIsEditDialogOpen(true);
  };

  const setConfig = (dto: ConfigDTO) => {
    applySettingsFromDto(dto, setCommonSettings, setExamSettings, setBoardSettings);
  };

  let config: ConfigDTO = settingsToConfig(mode, commonSettings, examSettings, boardSettings);

  const saveConfig = () => {
    config = settingsToConfig(mode, commonSettings, examSettings, boardSettings);
    setIsOpenSaveConfig(true);
  };

  const updateCategories = (categoryNames: string[]) => {
    setCategoryNames(categoryNames);
    setQuestionFileParseError(false);

    setBoardSettings((prev: BoardSettings) => {
      const newRules = { ...prev.rankingPromotionRules };

      categoryNames.forEach((cat) => {
        if (!(cat in newRules)) {
          newRules[cat] = 1;
        }
      });

      Object.keys(newRules).forEach((cat) => {
        if (!categoryNames.includes(cat)) {
          delete newRules[cat];
        }
      });

      return {
        ...prev,
        rankingPromotionRules: newRules,
      };
    });
  };

  const updateQuestionList = (questions: Question[]) => {
    setQuestionList(questions);
    setExamSettings({
      ...examSettings,
      selectedQuestionIds: questions.map((question) => question.id),
    });
  };

  useEffect(() => {
    if (!commonSettings.questionFilePath) return;
    service
      .parseQuestions(commonSettings.questionFilePath)
      .then((res) => {
        const data = res.data;
        console.log(data.questions);
        updateCategories(data.categories);
        updateQuestionList(data.questions);
      })
      .catch((error) =>
        setError(
          'Wystąpił błąd podczas wczytywania pliku z pytaniami:\n' + error.response.data.message
        )
      );
  }, [commonSettings.questionFilePath, mode]);

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
        height: '80%',
        padding: '15px',
        justifyContent: 'space-between',
      }}
    >
      {isEditDialogOpen && (
        <EditConfig setConfig={setConfig} mode={mode} setIsEditDialogOpen={setIsEditDialogOpen} />
      )}
      {isOpenSaveConfig && (
        <CreateConfig config={config} mode={mode} setIsOpen={setIsOpenSaveConfig} />
      )}

      <h1
        className="centered"
        style={{
          fontSize: '2.2em',
          color: theme.palette.main.info_text,
          textShadow: 'none',
          paddingBottom: '20px',
        }}
      >
        Ustawienia
      </h1>

      <div
        style={{
          height: '57vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ overflow: mode === 'quiz' ? 'visible' : 'auto' }}>
          <CommonConfig commonSettings={commonSettings} setCommonSettings={setCommonSettings} />
          <Divider />
          {mode === 'quiz' && <QuizConfig />}
          {mode === 'board' && (
            <BoardConfig
              settings={boardSettings}
              setSettings={setBoardSettings}
              categoryNames={categoryNames}
              parseError={questionFileParseError}
            />
          )}
          {mode === 'exam' && (
            <ExamConfig
              settings={examSettings}
              setSettings={setExamSettings}
              questionList={questionList}
              questionListError={questionFileParseError}
            />
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {mode != 'quiz' && (
          <>
            <ButtonCustom style={{ width: '50%', marginBottom: '0' }} onClick={editConfig}>
              Zapisane ustawienia
            </ButtonCustom>
            <ButtonCustom style={{ width: '40%' }} onClick={saveConfig}>
              Zapisz
            </ButtonCustom>
          </>
        )}
      </div>
    </div>
  );
}
