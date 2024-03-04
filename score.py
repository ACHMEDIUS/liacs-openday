import os
import datetime

score = []  # list of scores

def save_scores(filename):
    score.sort(reverse=True)  
    with open(filename, 'a') as file:
        for s in score:
            minutes = int(s[0] // 60)
            seconds = int(s[0] % 60)
            time_str = f"{minutes}:{seconds:02d}"
            file.write(time_str + ' - ' + s[1] + '\n')

def delete_scores(filename):
    with open(filename, 'w') as file:
        file.write('')

def main():
    print("Enter a blank score to exit the program")
    filename = 'scores.txt'  
    while True:
        new_score = input("Enter a new score: ")
        if new_score == '':
            break
        elif new_score.lower() == 'delete':
            delete_scores(filename)
            print("Scores deleted.")
            continue
        name = input("Enter a name: ")
        score.append((int(new_score), name))  # add a new score and name to the list

    # If no scores.txt
    if not os.path.exists(filename):
        open(filename, 'w').close()
    save_scores(filename)

if __name__ == "__main__":
    main()