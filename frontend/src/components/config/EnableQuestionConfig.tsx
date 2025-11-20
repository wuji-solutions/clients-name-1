import RoundCheckButton, { ButtonCustom } from '../Button';
import Divider from '../Divider';
import { CenteredLabel } from '../Fields';
import Modal from '../Modal';
import { ExamSettings } from './ExamConfig';
import { Question } from '../../common/types';
import theme from '../../common/theme';
import ImageMiniature from '../ImageMiniature';

interface Props {
  readonly settings: ExamSettings;
  readonly setSettings: React.Dispatch<React.SetStateAction<ExamSettings>>;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly isError: boolean;
  readonly questionList: Question[];
}

export default function EnableQuestionConfig({
  settings,
  setSettings,
  setIsOpen,
  isError,
  questionList,
}: Props) {
  const containsQuestionId = (questionId: string): boolean =>
    settings.selectedQuestionIds.includes(Number.parseInt(questionId));

  const handleSelect = (questionId: string): void => {
    const questionIdNum = Number.parseInt(questionId);
    if (containsQuestionId(questionId)) {
      setSettings({
        ...settings,
        selectedQuestionIds: settings.selectedQuestionIds.filter((x) => x !== questionIdNum),
      });
    } else {
      setSettings({
        ...settings,
        selectedQuestionIds: settings.selectedQuestionIds.concat([questionIdNum]),
      });
    }
  };
  return (
    <Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflowY: 'auto',
          height: '90vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'space-evenly',
            height: '95%',
          }}
        >
          {isError ? (
            <h1 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
              Upewnij się, że plik z pytaniami jest poprawny
            </h1>
          ) : (
            <>
              <h1 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
                Lista pytań
              </h1>
              <Divider></Divider>
              {questionList.length === 0 && (
                <h2 style={{ color: theme.palette.main.info_text, textShadow: 'none' }}>
                  Brak pytań
                </h2>
              )}
              <div
                style={{
                  overflowY: 'scroll',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  color: theme.palette.main.info_text,
                  textShadow: 'none',
                }}
              >
                {questionList.map((question, index) => {
                  return (
                    <div
                      key={question.id}
                      style={{ display: 'flex', margin: '10px', padding: '10px', gap: '20px' }}
                    >
                      <CenteredLabel
                        style={{ width: '100%', maxWidth: '500px', textAlign: 'left' }}
                      >{`${index + 1}. ${question.task} ${(<ImageMiniature imageUrl={question.imageUrl} imageBase64={question.imageBase64} />)}`}</CenteredLabel>
                      <RoundCheckButton
                        selected={containsQuestionId(String(question.id))}
                        onClick={() => handleSelect(String(question.id))}
                      />
                    </div>
                  );
                })}
              </div>
              <Divider></Divider>
            </>
          )}

          <ButtonCustom style={{ marginTop: '20px' }} onClick={() => setIsOpen(false)}>
            Zakończ
          </ButtonCustom>
        </div>
      </div>
    </Modal>
  );
}
