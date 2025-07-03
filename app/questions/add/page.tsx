'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';

interface QuestionForm {
  question: string;
  category: string;
  email: string;
  tags: string[];
  context?: string;
}

const categories = [
  'Academic',
  'Career',
  'Research',
  'Admission',
  'Financial',
  'International',
  'Campus Life',
  'Technology',
  'General',
];

const suggestedTags = [
  'programming',
  'curriculum',
  'internship',
  'career',
  'research',
  'masters',
  'ai',
  'admission',
  'scholarship',
  'international',
  'employment',
  'statistics',
  'exchange',
  'study abroad',
  'thesis',
  'projects',
  'tuition',
  'housing',
  'clubs',
  'activities',
  'faculty',
  'facilities',
];

export default function AddQuestionPage() {
  const [form, setForm] = useState<QuestionForm>({
    question: '',
    category: '',
    email: '',
    tags: [],
    context: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (form.question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    }

    if (!form.category) {
      newErrors.category = 'Category is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Submitting question:', form);

      setSubmitStatus('success');
      setForm({
        question: '',
        category: '',
        email: '',
        tags: [],
        context: '',
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Failed to submit question:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !form.tags.includes(trimmedTag)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Submit a Question</h1>
        <p className="text-muted-foreground">
          Have questions about LIACS or our programs? Submit them here and we&apos;ll address them
          during the presentation.
        </p>
      </div>

      {submitStatus === 'success' && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your question has been submitted successfully! It will be reviewed and may be addressed
            during the presentation.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was an error submitting your question. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    placeholder="What would you like to know about LIACS?"
                    value={form.question}
                    onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
                    className={`min-h-[120px] ${errors.question ? 'border-red-500' : ''}`}
                  />
                  {errors.question && (
                    <p className="mt-1 text-sm text-red-600">{errors.question}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {form.question.length}/500 characters
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.category}
                      onValueChange={value => setForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="context">Additional Context (Optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Provide any additional context or background for your question..."
                    value={form.context}
                    onChange={e => setForm(prev => ({ ...prev, context: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Tags (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => addTag(newTag)}
                        disabled={!newTag.trim()}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-leiden hover:bg-leiden/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Question
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={form.tags.includes(tag)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      form.tags.includes(tag)
                        ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400'
                        : 'cursor-pointer border-gray-300 hover:border-leiden hover:bg-leiden hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">Good questions:</h4>
                <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Specific and clear</li>
                  <li>Relevant to LIACS programs</li>
                  <li>About academics, career, or research</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Please avoid:</h4>
                <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Personal information requests</li>
                  <li>Questions already answered on our website</li>
                  <li>Overly broad or vague questions</li>
                </ul>
              </div>

              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground">
                  Questions are reviewed before being presented. Not all questions may be addressed
                  during the session.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
