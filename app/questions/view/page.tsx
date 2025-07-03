'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Clock, User, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  timestamp: number;
  approved: boolean;
  userEmail?: string;
  category?: string;
  tags?: string[];
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What programming languages are taught in the Computer Science program at LIACS?',
    timestamp: Date.now() - 3600000,
    approved: true,
    userEmail: 'student@example.com',
    category: 'Academic',
    tags: ['programming', 'curriculum'],
  },
  {
    id: '2',
    question: 'Are there opportunities for internships during the program?',
    timestamp: Date.now() - 7200000,
    approved: true,
    userEmail: 'visitor@example.com',
    category: 'Career',
    tags: ['internship', 'career'],
  },
  {
    id: '3',
    question: "What research areas are available for Master's students?",
    timestamp: Date.now() - 10800000,
    approved: true,
    userEmail: 'prospective@student.com',
    category: 'Research',
    tags: ['research', 'masters'],
  },
  {
    id: '4',
    question: 'How competitive is the admission process for the AI track?',
    timestamp: Date.now() - 14400000,
    approved: true,
    userEmail: 'applicant@example.com',
    category: 'Admission',
    tags: ['ai', 'admission'],
  },
  {
    id: '5',
    question: 'What kind of projects do students work on in their final year?',
    timestamp: Date.now() - 18000000,
    approved: true,
    userEmail: 'parent@example.com',
    category: 'Academic',
    tags: ['projects', 'thesis'],
  },
  {
    id: '6',
    question: 'Are there scholarships available for international students?',
    timestamp: Date.now() - 21600000,
    approved: false,
    userEmail: 'international@student.com',
    category: 'Financial',
    tags: ['scholarship', 'international'],
  },
  {
    id: '7',
    question: 'What is the job placement rate for LIACS graduates?',
    timestamp: Date.now() - 25200000,
    approved: true,
    userEmail: 'career@seeker.com',
    category: 'Career',
    tags: ['employment', 'statistics'],
  },
  {
    id: '8',
    question: 'Can students participate in international exchange programs?',
    timestamp: Date.now() - 28800000,
    approved: true,
    userEmail: 'exchange@student.com',
    category: 'International',
    tags: ['exchange', 'study abroad'],
  },
];

export default function ViewQuestionsPage() {
  const [questions] = useState<Question[]>(sampleQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(sampleQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories = Array.from(
    new Set(questions.map(q => q.category).filter((cat): cat is string => Boolean(cat)))
  );

  useEffect(() => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(
        q =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => (statusFilter === 'approved' ? q.approved : !q.approved));
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'category':
        filtered.sort((a, b) => (a.category ?? '').localeCompare(b.category ?? ''));
        break;
    }

    setFilteredQuestions(filtered);
  }, [questions, searchTerm, categoryFilter, statusFilter, sortBy]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Academic: 'bg-blue-100 text-blue-800',
      Career: 'bg-green-100 text-green-800',
      Research: 'bg-purple-100 text-purple-800',
      Admission: 'bg-orange-100 text-orange-800',
      Financial: 'bg-yellow-100 text-yellow-800',
      International: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Q&A Questions</h1>
        <p className="text-muted-foreground">
          Browse and search through submitted questions from visitors
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions, emails, or tags..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredQuestions.length} of {questions.length} questions
        </p>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No questions found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map(question => (
            <Card
              key={question.id}
              className={`transition-all hover:shadow-md ${
                question.approved ? 'border-green-200' : 'border-orange-200'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {question.approved ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <Badge variant={question.approved ? 'default' : 'secondary'}>
                        {question.approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {question.category && (
                        <Badge variant="outline" className={getCategoryColor(question.category)}>
                          {question.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(question.timestamp)}
                      </div>
                    </div>

                    <h3 className="mb-3 text-lg font-medium text-foreground">
                      {question.question}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {question.userEmail}
                      </div>
                    </div>

                    {question.tags && question.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredQuestions.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            End of questions. Total: {filteredQuestions.length}
          </p>
        </div>
      )}
    </div>
  );
}
