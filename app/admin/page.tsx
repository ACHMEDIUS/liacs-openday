'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Settings,
  MessageSquare,
  Gamepad2,
  Code,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Types
interface WheelSettings {
  items: string[];
  colors: string[];
  spinDuration: number;
  autoSpin: boolean;
  soundEnabled: boolean;
  confettiEnabled: boolean;
}

interface Question {
  id: string;
  question: string;
  timestamp: number;
  approved: boolean;
  userEmail?: string;
}

interface ProgrammingQuestion {
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

// Default settings
const defaultWheelSettings: WheelSettings = {
  items: [
    'LIACS Hoodie',
    'LIACS T-Shirt',
    'Computer Science Book',
    'Programming Stickers',
    'University Pen Set',
    'LIACS Mug',
    'Tech Conference Ticket',
    'Programming Tutorial Access',
  ],
  colors: ['#001158', '#f46e32', '#003366', '#ff6b35', '#004080', '#e55a2b', '#002244', '#d4481f'],
  spinDuration: 3000,
  autoSpin: false,
  soundEnabled: true,
  confettiEnabled: true,
};

const sampleQnaQuestions: Question[] = [
  {
    id: '1',
    question: 'What programming languages are taught in the Computer Science program?',
    timestamp: Date.now() - 3600000,
    approved: false,
    userEmail: 'student@example.com',
  },
  {
    id: '2',
    question: 'Are there opportunities for internships during the program?',
    timestamp: Date.now() - 7200000,
    approved: true,
    userEmail: 'visitor@example.com',
  },
];

const sampleProgrammingQuestions: ProgrammingQuestion[] = [
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
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('wheel');
  const [wheelSettings, setWheelSettings] = useState<WheelSettings>(defaultWheelSettings);
  const [qnaQuestions, setQnaQuestions] = useState<Question[]>(sampleQnaQuestions);
  const [programmingQuestions] = useState<ProgrammingQuestion[]>(sampleProgrammingQuestions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('wheelSettings');
    if (savedSettings) {
      setWheelSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('wheelSettings', JSON.stringify(wheelSettings));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateWheelItems = (items: string[]) => {
    setWheelSettings(prev => ({ ...prev, items }));
  };

  const addWheelItem = () => {
    const newItems = [...wheelSettings.items, 'New Prize'];
    updateWheelItems(newItems);
  };

  const removeWheelItem = (index: number) => {
    const newItems = wheelSettings.items.filter((_, i) => i !== index);
    updateWheelItems(newItems);
  };

  const updateWheelItem = (index: number, value: string) => {
    const newItems = [...wheelSettings.items];
    newItems[index] = value;
    updateWheelItems(newItems);
  };

  const updateWheelColor = (index: number, value: string) => {
    const newColors = [...wheelSettings.colors];
    newColors[index] = value;
    setWheelSettings(prev => ({ ...prev, colors: newColors }));
  };

  // Q&A Functions
  const approveQuestion = (questionId: string) => {
    setQnaQuestions(prev => prev.map(q => (q.id === questionId ? { ...q, approved: true } : q)));
  };

  const deleteQnaQuestion = (questionId: string) => {
    setQnaQuestions(prev => prev.filter(q => q.id !== questionId));
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
              Please log in to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Admin Panel</h1>
        <p className="text-muted-foreground">Manage LIACS Open Day settings and content</p>
      </div>

      {saveMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <div>{saveMessage}</div>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wheel" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Wheel Settings
          </TabsTrigger>
          <TabsTrigger value="qna" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Q&A Management
          </TabsTrigger>
          <TabsTrigger value="programming" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Programming Questions
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General Settings
          </TabsTrigger>
        </TabsList>

        {/* Wheel Settings Tab */}
        <TabsContent value="wheel" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Wheel Items */}
            <Card>
              <CardHeader>
                <CardTitle>Wheel Items</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure the prizes on the wheel of fortune
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {wheelSettings.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={e => updateWheelItem(index, e.target.value)}
                      placeholder={`Prize ${index + 1}`}
                    />
                    <input
                      type="color"
                      value={wheelSettings.colors[index] || '#001158'}
                      onChange={e => updateWheelColor(index, e.target.value)}
                      className="h-10 w-16 rounded border"
                    />
                    <Button size="sm" variant="destructive" onClick={() => removeWheelItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addWheelItem} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prize
                </Button>
              </CardContent>
            </Card>

            {/* Wheel Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Wheel Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">Adjust wheel behavior and effects</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="spinDuration">Spin Duration (ms)</Label>
                  <Input
                    id="spinDuration"
                    type="number"
                    value={wheelSettings.spinDuration}
                    onChange={e =>
                      setWheelSettings(prev => ({
                        ...prev,
                        spinDuration: parseInt(e.target.value) || 3000,
                      }))
                    }
                    min="1000"
                    max="10000"
                    step="500"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    How long the wheel spins (1000-10000ms)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSpin">Auto Spin</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically spin when page loads
                    </p>
                  </div>
                  <Switch
                    id="autoSpin"
                    checked={wheelSettings.autoSpin}
                    onCheckedChange={checked =>
                      setWheelSettings(prev => ({ ...prev, autoSpin: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="soundEnabled">Sound Effects</Label>
                    <p className="text-xs text-muted-foreground">
                      Play sound when spinning and winning
                    </p>
                  </div>
                  <Switch
                    id="soundEnabled"
                    checked={wheelSettings.soundEnabled}
                    onCheckedChange={checked =>
                      setWheelSettings(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="confettiEnabled">Confetti Effects</Label>
                    <p className="text-xs text-muted-foreground">
                      Show confetti animation when winning
                    </p>
                  </div>
                  <Switch
                    id="confettiEnabled"
                    checked={wheelSettings.confettiEnabled}
                    onCheckedChange={checked =>
                      setWheelSettings(prev => ({ ...prev, confettiEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-leiden hover:bg-leiden/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Q&A Management Tab */}
        <TabsContent value="qna" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Q&A Questions ({qnaQuestions.length})</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage submitted questions from visitors
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qnaQuestions.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No questions submitted yet
                  </p>
                ) : (
                  qnaQuestions.map(question => (
                    <Card
                      key={question.id}
                      className={`${question.approved ? 'border-green-200' : 'border-orange-200'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              {question.approved ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-orange-600" />
                              )}
                              <Badge variant={question.approved ? 'default' : 'secondary'}>
                                {question.approved ? 'Approved' : 'Pending'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(question.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">
                              From: {question.userEmail}
                            </p>
                            <p className="text-foreground">{question.question}</p>
                          </div>
                          <div className="flex gap-2">
                            {!question.approved && (
                              <Button
                                size="sm"
                                onClick={() => approveQuestion(question.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteQnaQuestion(question.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programming Questions Tab */}
        <TabsContent value="programming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programming Questions ({programmingQuestions.length})</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage interactive programming challenge questions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-leiden hover:bg-leiden/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Question
                </Button>
                {programmingQuestions.map(question => (
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
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Configure global application settings</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input id="eventTitle" defaultValue="LIACS Open Day" placeholder="Event title" />
              </div>
              <div>
                <Label htmlFor="eventDescription">Event Description</Label>
                <Textarea
                  id="eventDescription"
                  defaultValue="Welcome to the Leiden Institute of Advanced Computer Science Open Day!"
                  placeholder="Event description"
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
