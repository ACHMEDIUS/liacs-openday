'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Question {
  id: string;
  language: string;
  title: string;
  description: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  createdAt: number;
}

const initialQuestions: Question[] = [
  {
    id: '1',
    language: 'Python',
    title: 'List Comprehension Bug',
    description: 'This code should create a list of squares for even numbers, but it has a bug:',
    code: `numbers = [1, 2, 3, 4, 5, 6]
result = [x**2 for x in numbers if x % 2 = 0]
print(result)`,
    options: [
      'Change x**2 to x*2',
      'Change = to ==',
      'Change % to //',
      'Add parentheses around x % 2',
    ],
    correctAnswer: 1,
    explanation: 'The bug is using = (assignment) instead of == (comparison) in the condition.',
    difficulty: 'Easy',
    category: 'Syntax',
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    language: 'JavaScript',
    title: 'Function Scope Issue',
    description: 'This function should return the sum of an array, but it doesn&apos;t work:',
    code: `function sumArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    options: [
      'Initialize sum variable before the loop',
      'Change let to var',
      'Use arr.forEach instead',
      'Add semicolon after return sum',
    ],
    correctAnswer: 0,
    explanation: 'The variable "sum" is not declared. It should be initialized before the loop.',
    difficulty: 'Medium',
    category: 'Variables',
    createdAt: Date.now() - 172800000,
  },
];

export default function QuestionsPage() {
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Question>>({
    language: '',
    title: '',
    description: '',
    code: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Easy',
    category: '',
  });

  const resetForm = () => {
    setFormData({
      language: '',
      title: '',
      description: '',
      code: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'Easy',
      category: '',
    });
    setIsCreating(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.code || !formData.language) {
      return;
    }

    const questionData: Question = {
      id: editingQuestion?.id || Date.now().toString(),
      language: formData.language!,
      title: formData.title!,
      description: formData.description || '',
      code: formData.code!,
      options: formData.options!,
      correctAnswer: formData.correctAnswer!,
      explanation: formData.explanation || '',
      difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard',
      category: formData.category || 'General',
      createdAt: editingQuestion?.createdAt || Date.now(),
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => (q.id === editingQuestion.id ? questionData : q)));
    } else {
      setQuestions(prev => [questionData, ...prev]);
    }

    resetForm();
  };

  const startEdit = (question: Question) => {
    setFormData(question);
    setEditingQuestion(question);
    setIsCreating(true);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || question.language === filterLanguage;
    const matchesDifficulty =
      filterDifficulty === 'all' || question.difficulty === filterDifficulty;

    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(formData.options || ['', '', '', ''])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Please log in to manage programming questions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Programming Questions Manager</h1>
        <p className="text-muted-foreground">
          Create and manage programming questions for the interactive challenge.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Button onClick={() => setIsCreating(true)} className="bg-leiden hover:bg-leiden/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>

          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="JavaScript">JavaScript</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="C++">C++</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="language">Programming Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={value => updateFormField('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                      <SelectItem value="Java">Java</SelectItem>
                      <SelectItem value="C++">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={value => updateFormField('difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={e => updateFormField('category', e.target.value)}
                    placeholder="e.g., Syntax, Logic, Arrays"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => updateFormField('title', e.target.value)}
                  placeholder="Brief title describing the bug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => updateFormField('description', e.target.value)}
                  placeholder="Describe what the code should do and what's wrong"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="code">Code (with bug)</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={e => updateFormField('code', e.target.value)}
                  placeholder="Paste the buggy code here"
                  className="min-h-[120px] font-mono"
                  required
                />
              </div>

              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {formData.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-8 font-mono text-sm">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        value={option}
                        onChange={e => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => updateFormField('correctAnswer', index)}
                        className="h-4 w-4"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={e => updateFormField('explanation', e.target.value)}
                  placeholder="Explain why the correct answer is right"
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-leiden hover:bg-leiden/90">
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions ({filteredQuestions.length})</h2>

        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No questions found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map(question => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{question.title}</CardTitle>
                    <div className="mt-2 flex gap-2">
                      <Badge>{question.language}</Badge>
                      <Badge
                        variant={
                          question.difficulty === 'Easy'
                            ? 'secondary'
                            : question.difficulty === 'Medium'
                              ? 'default'
                              : 'destructive'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">{question.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{question.description}</p>
                <div className="rounded-lg bg-gray-900 p-4 text-green-400">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    <code>{question.code}</code>
                  </pre>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold">Options:</p>
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`text-sm ${
                        index === question.correctAnswer
                          ? 'font-semibold text-green-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
