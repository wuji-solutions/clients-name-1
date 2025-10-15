import json

def get_list(inp):
    splitted = inp.split(", ")
    try:
        return [int(x) for x in splitted]
    except ValueError:
        raise ValueError("Lista musi zawierać liczby całkowite oddzielone przecinkiem i spacją (np. 1, 2, 3)")

def get_map_diff(inp):
    splitted = inp.split(", ")
    if len(splitted) != 3:
        raise ValueError("Podaj dokładnie 3 liczby w formacie: EASY, MEDIUM, HARD (np. 1, 2, 3)")
    try:
        splitted = [int(x) for x in splitted]
    except ValueError:
        raise ValueError("Wszystkie wartości muszą być liczbami całkowitymi")
    return {"EASY": splitted[0], "MEDIUM": splitted[1], "HARD": splitted[2]}

def get_map_cat(_):
    res = {}
    while True:
        inp = input('Podaj kategorię i minimalną liczbę poprawnych odpowiedzi [String Int] (lub wpisz "quit 0", aby zakończyć): ')
        name, value = inp.split()
        if name == "quit":
            break
        res[name] = int(value)
    return res


game_attributes = [
    ("questionFilePath", "string"),
    ("questionDurationSeconds", "int"),
    ("type", "type")
]

exam_attributes = [
    ("totalDurationMinutes", "int"),
    ("requiredQuestionCount", "int"),
    ("randomizeQuestions", "bool"),
    ("enforceDifficultyBalance", "bool"),
    ("selectedQuestionIds", "list<int>"),
    ("zeroPointsOnCheating", "bool"),
    ("markQuestionOnCheating", "bool"),
    ("notifyTeacherOnCheating", "bool"),
    ("pointsPerDifficulty", "map<DifficultyLevel,int>"),
    ("allowGoingBack", "bool"),
    ("endImmediatelyAfterTime", "bool"),
    ("additionalTimeToAnswerAfterFinishInSeconds", "long")
]

board_attributes = [
    ("totalDurationMinutes", "int"),
    ("pointsPerDifficulty", "map<DifficultyLevel,int>"),
    ("rankingPromotionRules", "map<CategoryName,MinCorrectAnswers>"),
    ("showLeaderboard", "bool"),
    ("endImmediatelyAfterTime", "bool")
]

input_typer = {
    "string": lambda x: x,
    "int": lambda x: int(x),
    "type": lambda x: x,
    "bool": lambda x: x.lower() in ["true", "1", "tak", "yes"],
    "list<int>":  get_list,
    "long": lambda x: int(x),
    "map<DifficultyLevel,int>": get_map_diff,
    "map<CategoryName,MinCorrectAnswers>": get_map_cat
}


config = {}

config_type = input("Podaj typ konfiguracji (QUIZ / EXAM / BOARD): ").strip().upper()

if config_type == "QUIZ":
    curr_attr = game_attributes
elif config_type == "EXAM":
    curr_attr = game_attributes + exam_attributes
elif config_type == "BOARD":
    curr_attr = game_attributes + board_attributes
else:
    raise ValueError("Nieznany typ konfiguracji! Dozwolone: QUIZ, EXAM, BOARD")

print(f"\nTworzenie konfiguracji typu {config_type}:\n")

for attr_name, attr_type in curr_attr:
    if attr_name == "type":
        continue
    
    if "map<CategoryName" in attr_type:
        print(f"{attr_name} ({attr_type}) -> specjalny input:")
        value = input_typer[attr_type]()
    else:
        user_input = input(f"{attr_name} ({attr_type}): ")
        value = input_typer[attr_type](user_input)
    config[attr_name] = value

config["type"] = config_type

name = input("Provide config name(without .json): ")
path = input("Provide path to save config(to create config in current location just press ENTER): ")

json_name = f"{name}.json"
with open(json_name, "w", encoding="utf-8") as f:
    json.dump(config, f, indent=4, ensure_ascii=False)

print(f"\nConfig Saved: {json_name}")
print(json.dumps(config, indent=4, ensure_ascii=False))
