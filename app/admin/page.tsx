'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
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
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GENERAL_SETTINGS_STORAGE_KEY } from '@/lib/constants';
import { DEFAULT_YOUTUBE_URL, isValidYouTubeUrl } from '@/lib/youtube';
import programmingQuestionsData, { ProgrammingQuestion } from '@/lib/data/programming/questions';
import { AddQuestionDialog } from '@/components/app/add-question-dialog';
import {
  Loader2,
  Settings,
  MessageSquare,
  Gamepad2,
  Code,
  Plus,
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

type QuestionStatus = 'pending' | 'approved' | 'denied';

interface Question {
  id: string;
  text: string;
  status: QuestionStatus;
  accepted: boolean;
  main: boolean;
  answer: string;
  createdAt: number | null;
}

type GeneralSettings = {
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  youtubeLink: string;
};

const defaultGeneralSettings: GeneralSettings = {
  eventTitle: 'LIACS Open Day',
  eventDescription: 'Welcome to the Leiden Institute of Advanced Computer Science Open Day!',
  eventDate: new Date().toISOString().split('T')[0],
  youtubeLink: DEFAULT_YOUTUBE_URL,
};

// Default settings
const defaultWheelSettings: WheelSettings = {
  items: [],
  colors: [],
  spinDuration: 3000,
  autoSpin: false,
  soundEnabled: false,
  confettiEnabled: true,
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('wheel');
  const [wheelSettings, setWheelSettings] = useState<WheelSettings>(defaultWheelSettings);
  const [qnaQuestions, setQnaQuestions] = useState<Question[]>([]);
  const programmingQuestions: ProgrammingQuestion[] = programmingQuestionsData;
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questionError, setQuestionError] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [savingAnswerFor, setSavingAnswerFor] = useState<string | null>(null);
  const [questionActionLoading, setQuestionActionLoading] = useState<Record<string, boolean>>({});
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);
  const [generalSaveMessage, setGeneralSaveMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const setActionLoading = useCallback((questionId: string, isLoading: boolean) => {
    setQuestionActionLoading(prev => ({
      ...prev,
      [questionId]: isLoading,
    }));
  }, []);

  const handleGeneralInputChange = useCallback(
    (field: keyof GeneralSettings) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
        setGeneralSaveMessage('');
        if (field === 'youtubeLink') {
          setGeneralError('');
        }
      },
    []
  );

  const saveGeneralSettings = useCallback(() => {
    const trimmedTitle = generalSettings.eventTitle.trim();
    const trimmedDescription = generalSettings.eventDescription.trim();
    const trimmedLink = generalSettings.youtubeLink.trim() || DEFAULT_YOUTUBE_URL;

    if (trimmedLink && !isValidYouTubeUrl(trimmedLink)) {
      setGeneralError('Please enter a valid YouTube or youtu.be link.');
      return;
    }

    const payload: GeneralSettings = {
      eventTitle: trimmedTitle || defaultGeneralSettings.eventTitle,
      eventDescription: trimmedDescription || defaultGeneralSettings.eventDescription,
      eventDate: generalSettings.eventDate || defaultGeneralSettings.eventDate,
      youtubeLink: trimmedLink,
    };

    setGeneralError('');
    setGeneralSettings(payload);

    try {
      localStorage.setItem(GENERAL_SETTINGS_STORAGE_KEY, JSON.stringify(payload));
      setGeneralSaveMessage('General settings saved.');
      window.dispatchEvent(new CustomEvent('general-settings-updated', { detail: payload }));
      setTimeout(() => setGeneralSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save general settings:', error);
      setGeneralError('Unable to save settings. Please try again.');
    }
  }, [generalSettings]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('wheelSettings');
    if (savedSettings) {
      setWheelSettings(JSON.parse(savedSettings));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GENERAL_SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<GeneralSettings>;
        setGeneralSettings(prev => ({
          ...prev,
          ...parsed,
          youtubeLink: parsed.youtubeLink ?? prev.youtubeLink,
        }));
      }
    } catch (error) {
      console.error('Failed to load general settings:', error);
    }
  }, []);

  useEffect(() => {
    const questionsQuery = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      questionsQuery,
      snapshot => {
        const nextQuestions: Question[] = snapshot.docs
          .map(docSnapshot => {
            const data = docSnapshot.data() as {
              text?: unknown;
              question?: unknown;
              accepted?: unknown;
              approved?: unknown;
              status?: unknown;
              main?: unknown;
              answer?: unknown;
              createdAt?: unknown;
            };
            const rawCreatedAt = data.createdAt;
            let createdAt: number | null = null;
            if (typeof rawCreatedAt === 'number') {
              createdAt = rawCreatedAt;
            } else if (
              rawCreatedAt &&
              typeof (rawCreatedAt as { toMillis?: () => number }).toMillis === 'function'
            ) {
              createdAt = (rawCreatedAt as { toMillis: () => number }).toMillis();
            }
            const rawText =
              typeof data.text === 'string'
                ? data.text
                : typeof data.question === 'string'
                  ? data.question
                  : '';
            const text = rawText.trim();
            if (!text) {
              return null;
            }
            const accepted =
              typeof data.accepted === 'boolean'
                ? data.accepted
                : typeof data.approved === 'boolean'
                  ? data.approved
                  : false;
            const rawStatus = data.status;
            const status: QuestionStatus =
              rawStatus === 'approved' || rawStatus === 'denied' || rawStatus === 'pending'
                ? rawStatus
                : accepted
                  ? 'approved'
                  : 'pending';
            const main = Boolean(data.main);
            const answer = typeof data.answer === 'string' ? data.answer : '';

            return {
              id: docSnapshot.id,
              text,
              status,
              accepted: Boolean(accepted),
              main,
              answer,
              createdAt,
            } satisfies Question;
          })
          .filter((value): value is Question => Boolean(value));

        setQnaQuestions(nextQuestions);
        setAnswerDrafts(prevDrafts => {
          const updatedDrafts: Record<string, string> = {};
          nextQuestions.forEach(question => {
            updatedDrafts[question.id] =
              question.id in prevDrafts ? prevDrafts[question.id] : question.answer;
          });
          return updatedDrafts;
        });
        setQuestionError('');
      },
      error => {
        console.error('Failed to load questions:', error);
        setQuestionError('Unable to load questions right now. Please try again later.');
      }
    );

    return () => unsubscribe();
  }, []);

  const approveQuestion = useCallback(
    async (questionId: string) => {
      setActionLoading(questionId, true);
      try {
        setQuestionError('');
        await updateDoc(doc(db, 'questions', questionId), {
          accepted: true,
          status: 'approved',
        });
      } catch (error) {
        console.error('Failed to approve question:', error);
        setQuestionError('Failed to approve the question. Please try again.');
      } finally {
        setActionLoading(questionId, false);
      }
    },
    [setActionLoading]
  );

  const denyQuestion = useCallback(
    async (questionId: string) => {
      setActionLoading(questionId, true);
      try {
        setQuestionError('');
        await updateDoc(doc(db, 'questions', questionId), {
          accepted: false,
          status: 'denied',
          main: false,
        });
      } catch (error) {
        console.error('Failed to deny question:', error);
        setQuestionError('Failed to deny the question. Please try again.');
      } finally {
        setActionLoading(questionId, false);
      }
    },
    [setActionLoading]
  );

  const deleteQnaQuestion = useCallback(
    async (questionId: string) => {
      setActionLoading(questionId, true);
      try {
        setQuestionError('');
        await deleteDoc(doc(db, 'questions', questionId));
      } catch (error) {
        console.error('Failed to delete question:', error);
        setQuestionError('Failed to delete the question. Please try again.');
      } finally {
        setActionLoading(questionId, false);
      }
    },
    [setActionLoading]
  );

  const setAsMainQuestion = useCallback(
    async (questionId: string) => {
      setActionLoading(questionId, true);
      try {
        setQuestionError('');
        const currentMainSnapshot = await getDocs(
          query(collection(db, 'questions'), where('main', '==', true))
        );

        await Promise.all(
          currentMainSnapshot.docs
            .filter(docSnapshot => docSnapshot.id !== questionId)
            .map(docSnapshot =>
              updateDoc(docSnapshot.ref, {
                main: false,
              })
            )
        );

        await updateDoc(doc(db, 'questions', questionId), {
          main: true,
          accepted: true,
          status: 'approved',
        });
      } catch (error) {
        console.error('Failed to set question as current:', error);
        setQuestionError('Failed to mark the question as current. Please try again.');
      } finally {
        setActionLoading(questionId, false);
      }
    },
    [setActionLoading]
  );

  const clearMainQuestion = useCallback(
    async (questionId: string) => {
      setActionLoading(questionId, true);
      try {
        setQuestionError('');
        await updateDoc(doc(db, 'questions', questionId), {
          main: false,
        });
      } catch (error) {
        console.error('Failed to clear main question:', error);
        setQuestionError('Failed to clear the current question. Please try again.');
      } finally {
        setActionLoading(questionId, false);
      }
    },
    [setActionLoading]
  );

  const saveAnswer = useCallback(
    async (questionId: string) => {
      const draft = (answerDrafts[questionId] ?? '').trim();
      setSavingAnswerFor(questionId);
      try {
        setQuestionError('');
        await updateDoc(doc(db, 'questions', questionId), {
          answer: draft,
        });
        setAnswerDrafts(prev => ({
          ...prev,
          [questionId]: draft,
        }));
      } catch (error) {
        console.error('Failed to save answer:', error);
        setQuestionError('Failed to save the answer. Please try again.');
      } finally {
        setSavingAnswerFor(null);
      }
    },
    [answerDrafts]
  );

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('wheelSettings', JSON.stringify(wheelSettings));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateWheelItems = (items: string[]) => {
    setWheelSettings(prev => {
      const defaultColor = '#001158';
      const colors = [...prev.colors];
      if (colors.length < items.length) {
        while (colors.length < items.length) {
          colors.push(defaultColor);
        }
      } else if (colors.length > items.length) {
        colors.length = items.length;
      }
      return { ...prev, items, colors };
    });
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

  if (loading || isLoading) {
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
            <span className="hidden text-sm font-medium sm:inline">Wheel Settings</span>
            <span className="sr-only sm:hidden">Wheel Settings</span>
          </TabsTrigger>
          <TabsTrigger value="qna" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">Q&amp;A Management</span>
            <span className="sr-only sm:hidden">Q&amp;A Management</span>
          </TabsTrigger>
          <TabsTrigger value="programming" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">Programming Questions</span>
            <span className="sr-only sm:hidden">Programming Questions</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">General Settings</span>
            <span className="sr-only sm:hidden">General Settings</span>
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
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Q&A Questions ({qnaQuestions.length})</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage submitted questions from visitors
                </p>
              </div>
              <AddQuestionDialog />
            </CardHeader>
            <CardContent>
              {questionError && (
                <Alert variant="destructive" className="mb-4">
                  {questionError}
                </Alert>
              )}
              <div className="space-y-4">
                {qnaQuestions.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No questions submitted yet
                  </p>
                ) : (
                  qnaQuestions.map(question => (
                    <Card
                      key={question.id}
                      className={`border ${
                        question.main
                          ? 'border-leiden shadow-[0_0_0_1px_rgba(0,17,88,0.3)]'
                          : question.status === 'approved'
                            ? 'border-green-200'
                            : question.status === 'denied'
                              ? 'border-destructive/40'
                              : 'border-orange-200'
                      }`}
                    >
                      <CardContent className="space-y-4 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {question.status === 'approved' ? (
                            <Badge className="bg-green-600 text-white hover:bg-green-600">
                              <CheckCircle className="mr-1 h-3.5 w-3.5" />
                              Approved
                            </Badge>
                          ) : question.status === 'denied' ? (
                            <Badge className="bg-destructive text-white hover:bg-destructive">
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              Denied
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin text-current" />
                              Pending
                            </Badge>
                          )}
                          {question.main && (
                            <Badge variant="outline" className="border-leiden text-leiden">
                              Current question
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {question.createdAt
                              ? new Date(question.createdAt).toLocaleString()
                              : 'Timestamp pending'}
                          </span>
                        </div>

                        <p className="text-base font-medium text-foreground">{question.text}</p>

                        <div className="space-y-2">
                          <Label htmlFor={`answer-${question.id}`} className="text-xs uppercase">
                            Answer (optional)
                          </Label>
                          <Textarea
                            id={`answer-${question.id}`}
                            value={answerDrafts[question.id] ?? ''}
                            onChange={event =>
                              setAnswerDrafts(prev => ({
                                ...prev,
                                [question.id]: event.target.value,
                              }))
                            }
                            rows={3}
                            placeholder="Type a short answer or leave empty"
                          />
                          <div className="flex items-center justify-end">
                            <Button
                              size="sm"
                              onClick={() => saveAnswer(question.id)}
                              disabled={savingAnswerFor === question.id}
                              className="flex items-center gap-2 bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                            >
                              {savingAnswerFor === question.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  Save Answer
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {question.status !== 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => approveQuestion(question.id)}
                              disabled={questionActionLoading[question.id]}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {questionActionLoading[question.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Approve'
                              )}
                            </Button>
                          )}
                          {question.status !== 'denied' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => denyQuestion(question.id)}
                              disabled={questionActionLoading[question.id]}
                            >
                              {questionActionLoading[question.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Deny'
                              )}
                            </Button>
                          )}
                          {question.main ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => clearMainQuestion(question.id)}
                              disabled={questionActionLoading[question.id]}
                            >
                              {questionActionLoading[question.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Clear Current'
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAsMainQuestion(question.id)}
                              disabled={questionActionLoading[question.id]}
                            >
                              {questionActionLoading[question.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Set as Current'
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteQnaQuestion(question.id)}
                            disabled={questionActionLoading[question.id]}
                          >
                            {questionActionLoading[question.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Delete'
                            )}
                          </Button>
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
              {generalSaveMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <div>{generalSaveMessage}</div>
                </Alert>
              )}
              {generalError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <div>{generalError}</div>
                </Alert>
              )}
              <div>
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  id="eventTitle"
                  value={generalSettings.eventTitle}
                  onChange={handleGeneralInputChange('eventTitle')}
                  placeholder="Event title"
                />
              </div>
              <div>
                <Label htmlFor="eventDescription">Event Description</Label>
                <Textarea
                  id="eventDescription"
                  value={generalSettings.eventDescription}
                  onChange={handleGeneralInputChange('eventDescription')}
                  placeholder="Event description"
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={generalSettings.eventDate}
                  onChange={handleGeneralInputChange('eventDate')}
                />
              </div>
              <div>
                <Label htmlFor="youtubeLink">YouTube Easter Egg Link</Label>
                <Input
                  id="youtubeLink"
                  value={generalSettings.youtubeLink}
                  onChange={handleGeneralInputChange('youtubeLink')}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  This video appears when visitors type “liacs”. Accepted formats: youtube.com or
                  youtu.be links.
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveGeneralSettings} className="bg-leiden hover:bg-leiden/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
