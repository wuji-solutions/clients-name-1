import json

def get_list(inp):
    splitted = inp.split(", ")
    try:
        return [int(x) for x in splitted]
    except ValueError:
        raise ValueError("List must be separeted with comma and space (ex. 1, 2, 3)")

def get_map_diff(inp):
    splitted = inp.split(", ")
    if len(splitted) != 3:
        raise ValueError("Input exactly 3 numbers separeted with comma and space: EASY, MEDIUM, HARD (ex. 1, 2, 3)")
    try:
        splitted = [int(x) for x in splitted]
    except ValueError:
        raise ValueError("All values must be integers")
    return {"EASY": splitted[0], "MEDIUM": splitted[1], "HARD": splitted[2]}

def get_map_cat(_):
    res = {}
    while True:
        inp = input('Input category name and minimum correct answers [String Int] (or input "quit 0", to end): ')
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

config_type = input("Config Type (QUIZ / EXAM / BOARD): ").strip().upper()

if config_type == "QUIZ":
    curr_attr = game_attributes
elif config_type == "EXAM":
    curr_attr = game_attributes + exam_attributes
elif config_type == "BOARD":
    curr_attr = game_attributes + board_attributes
else:
    raise ValueError("Unknown Type! Allowed: QUIZ, EXAM, BOARD")

print(f"\nCreating Config of type: {config_type}:\n")

for attr_name, attr_type in curr_attr:
    if attr_name == "type":
        continue
    
    if "map<CategoryName" in attr_type:
        print(f"{attr_name} ({attr_type}) -> special input:")
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
