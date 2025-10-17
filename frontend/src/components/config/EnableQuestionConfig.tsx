import { ButtonCustom } from "../Button";
import Divider from "../Divider";
import { CenteredLabel } from "../Fields";
import Modal from "../Modal";
import { ExamSettings } from "./ExamConfig";
import { Question } from "../../common/types";

interface Props {
  readonly settings: ExamSettings;
  readonly setSettings: React.Dispatch<React.SetStateAction<ExamSettings>>;
  readonly setIsOpen: (isOpen: boolean) => void;
  readonly isError: boolean;
  readonly questionList: Question[]
}

export default function EnableQuestionConfig({ settings, setSettings, setIsOpen, isError, questionList }: Props) {
    const containsQuestionId = (questionId: string): boolean => settings.selectedQuestionIds.includes(Number.parseInt(questionId))

    const handleSelect = (questionId: string): void => {
        const questionIdNum = Number.parseInt(questionId);
        if (containsQuestionId(questionId)) {
            setSettings({...settings, selectedQuestionIds:
                settings.selectedQuestionIds.filter(x => x !== questionIdNum)
            })
        } else {
            setSettings({...settings, selectedQuestionIds: settings.selectedQuestionIds.concat([questionIdNum])})
        }
    }
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
          overflowY: "hidden"
        }}
      >
        <div style={{ height:"40%" }}>
          {isError ? (
            <h1>Upewnij się, że plik z pytaniami jest poprawny</h1>
          ) : (
            <>
              <h1>Lista pytań</h1>
              <Divider></Divider>
              <div style={{ margin: '25px' }}></div>
              {questionList.length === 0 && <h2>Brak pytań</h2>}
              <div style={{overflowY: "scroll", maxHeight: "70%"}}>
              {questionList.map((question, index) => {
                return (
                  <div key={question.id} style={{ display: 'flex', margin: '10px' }}>
                    <CenteredLabel style={{ width: '70%' }}>{index+1}. {question.task}</CenteredLabel>
                    <ButtonCustom
                        onClick={(e) => handleSelect(String(question.id))}
                        >{containsQuestionId(String(question.id)) ? "Wybrano" : "Nie wybrano"}</ButtonCustom>
                  </div>
                );
              })}
              </div>
              <div style={{ margin: '25px' }}></div>
              <Divider></Divider>
            </>
          )}

          <ButtonCustom style={{ marginTop: '20px' }} onClick={() => setIsOpen(false)}>
            Zakończ
          </ButtonCustom>
        </div>
      </div>
    </Modal>
    )
}
