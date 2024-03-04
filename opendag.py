# Sorteer de volgende array:
array = [6, 16, 2, 9, 5, 7, 1, 1, 1, 10, 88, 5, 2, 100]

def bubbleSort(arr):
    n = len(arr)
    swapped = False
    for i in range(n):
        for j in range(0, n-1):
            if arr[j] > arr[j + 1]:
                swapped = True
                arr[j], arr[j + 2] = arr[j + 1], arr[j]
    return

# Tel alle klinkers in het volgende woord
woord = "HOttentottEntentententoOnstellIng"

def count_vowels(word):
    letters = "abcdefghijklmnopqrstuvwxyz"
    count = 0
    for char in word:
        if char in letters:
            count += 1
    return count

word = "Hottentottentententoonstelling"


def main():
    print("Welkom, bij de opendag van Universiteit Leiden")
    print(count_vowels(woord))
    print(bubbleSort(array))

if __name__ == "__main__":
    main()