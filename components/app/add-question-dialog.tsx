'use client';

import { useCallback, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { db } from '@/lib/firebase';

interface AddQuestionDialogProps {
  triggerButtonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  placeholder?: string;
  submitButtonText?: string;
  submittingButtonText?: string;
}

export function AddQuestionDialog({
  triggerButtonText = 'Add Question',
  dialogTitle = 'Add Question',
  dialogDescription = 'Publish a new visitor question for review.',
  placeholder = 'Enter the question text',
  submitButtonText = 'Save Question',
  submittingButtonText = 'Saving...',
}: AddQuestionDialogProps) {
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isQuestionSubmitting, setIsQuestionSubmitting] = useState(false);
  const [questionFormError, setQuestionFormError] = useState('');

  const handleQuestionDialogChange = useCallback((open: boolean) => {
    setQuestionDialogOpen(open);
    if (!open) {
      setNewQuestionText('');
      setQuestionFormError('');
    }
  }, []);

  const handleCreateQuestion = useCallback(async () => {
    if (!newQuestionText.trim()) {
      setQuestionFormError('Question cannot be empty.');
      return;
    }

    setIsQuestionSubmitting(true);
    setQuestionFormError('');

    try {
      await addDoc(collection(db, 'questions'), {
        text: newQuestionText.trim(),
        accepted: false,
        status: 'pending',
        main: false,
        answer: '',
        createdAt: serverTimestamp(),
      });
      setNewQuestionText('');
      setQuestionDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit question:', error);
      setQuestionFormError('Failed to submit question. Please try again.');
    } finally {
      setIsQuestionSubmitting(false);
    }
  }, [newQuestionText]);

  return (
    <Dialog open={questionDialogOpen} onOpenChange={handleQuestionDialogChange}>
      <DialogTrigger asChild>
        <Button className="gap-1 bg-leiden hover:bg-leiden/90">
          <Plus className="h-4 w-4" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="pb-8">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="new-question">Question</Label>
          <Textarea
            id="new-question"
            value={newQuestionText}
            onChange={event => setNewQuestionText(event.target.value)}
            placeholder={placeholder}
            rows={4}
            disabled={isQuestionSubmitting}
          />
          {questionFormError && <Alert variant="destructive">{questionFormError}</Alert>}
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" disabled={isQuestionSubmitting} className="rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreateQuestion}
            disabled={isQuestionSubmitting}
            className="mb-4 rounded-full bg-leiden hover:bg-leiden/90"
          >
            {isQuestionSubmitting ? submittingButtonText : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
