
// Function to trim the first line if it's blank
const trimFirstLine = (codeSnippet: string): string => {
  const lines = codeSnippet.split("\n");
  if (lines.length > 0 && lines[0].trim() === "") {
    return lines.slice(1).join("\n"); // Remove the first blank line
  }
  return codeSnippet; // Return unmodified if the first line isn't blank
};

interface CodeBlock {
  codeSnippet: string;
  language?: string;
}

export const sortingAlgorithms: CodeBlock[] = [
    // 1. BogoSort
    {
        codeSnippet: `
        import random
def bogo_sort(arr):
        def is_sorted(arr):
                return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))
        while not is_sorted(arr):
                random.shuffle(arr)
        return arr
`,
        language: "python",
    },
    // 2. SleepSort
    {
        codeSnippet: `
        import threading
        import time
        
def sleep_sort(arr):
    result = []
    def add_to_result(x):
        time.sleep(x)
        result.append(x)
    threads = [threading.Thread(target=add_to_result, args=(x,)) for x in arr]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    return result
`,
        language: "python",
    },
    // 3. MiracleSort (fictional example)
    {
        codeSnippet: `
def miracle_sort(arr):
    if not arr:
        return []
    return sorted(arr)  # Miraculously sorts the array instantly
`,
        language: "python",
    },
].map((sortingAlgorithm) => ({
    ...sortingAlgorithm,
    codeSnippet: trimFirstLine(sortingAlgorithm.codeSnippet),
}));
