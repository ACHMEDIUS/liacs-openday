'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface PresentationSlide {
  id: number;
  title: string;
  content: string;
  speaker: string;
  duration: string;
}

const presentationSlides: PresentationSlide[] = [
  {
    id: 1,
    title: 'Welcome to LIACS Open Day',
    content:
      "Welcome to the Leiden Institute of Advanced Computer Science! Today we'll explore the exciting world of computer science education and research at Leiden University.",
    speaker: 'Dr. Sarah Johnson, LIACS Director',
    duration: '5 min',
  },
  {
    id: 2,
    title: 'Our Computer Science Programs',
    content:
      "LIACS offers bachelor's and master's programs in Computer Science, covering areas like AI, data science, cybersecurity, software engineering, and theoretical computer science.",
    speaker: 'Prof. Michael Chen, Program Director',
    duration: '10 min',
  },
  {
    id: 3,
    title: 'Research Excellence',
    content:
      'Our research focuses on cutting-edge areas including machine learning, natural language processing, computer vision, algorithms, and human-computer interaction.',
    speaker: 'Dr. Emily Rodriguez, Research Coordinator',
    duration: '8 min',
  },
  {
    id: 4,
    title: 'Student Life & Opportunities',
    content:
      'Discover student organizations, internship opportunities, international exchanges, and career prospects for our computer science graduates.',
    speaker: 'Lisa van der Berg, Student Affairs',
    duration: '7 min',
  },
  {
    id: 5,
    title: 'Facilities & Labs',
    content:
      'Tour our state-of-the-art computer labs, research facilities, and collaborative spaces designed for modern computer science education.',
    speaker: 'Dr. James Park, Facilities Manager',
    duration: '6 min',
  },
  {
    id: 6,
    title: 'Q&A Session',
    content:
      'Time for questions from prospective students and their families. Ask anything about admissions, curriculum, or student life!',
    speaker: 'Panel of Faculty & Students',
    duration: '15 min',
  },
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const nextSlide = () => {
    if (currentSlide < presentationSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const slide = presentationSlides[currentSlide];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-leiden">LIACS Open Day Presentation</h1>
        <p className="text-muted-foreground">
          Live presentation about Computer Science at Leiden University
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Total Duration: ~50 minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Main Auditorium</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Live Audience</span>
          </div>
        </div>
      </div>

      {/* Main Presentation Area */}
      <Card className="mb-6">
        <CardHeader className="bg-leiden text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{slide.title}</CardTitle>
              <div className="mt-2 flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Slide {currentSlide + 1} of {presentationSlides.length}
                </Badge>
                <span className="text-sm opacity-90">{slide.speaker}</span>
                <span className="text-sm opacity-90">Duration: {slide.duration}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={togglePlayPause}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Slide Content */}
          <div className="mb-8 flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-semibold text-leiden">{slide.title}</h2>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {slide.content}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <Button onClick={prevSlide} disabled={currentSlide === 0} variant="outline">
              Previous
            </Button>

            <div className="flex gap-2">
              {presentationSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-8 rounded ${
                    index === currentSlide ? 'bg-leiden' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === presentationSlides.length - 1}
              className="bg-leiden hover:bg-leiden/90"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slide Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Presentation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {presentationSlides.map((slideItem, index) => (
              <div
                key={slideItem.id}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                  index === currentSlide ? 'border-leiden bg-leiden/5' : 'border-gray-200'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={index === currentSlide ? 'default' : 'outline'}>
                    Slide {index + 1}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{slideItem.duration}</span>
                </div>
                <h4 className="mb-2 font-semibold">{slideItem.title}</h4>
                <p className="line-clamp-2 text-sm text-muted-foreground">{slideItem.content}</p>
                <p className="mt-2 text-xs font-medium text-leiden">{slideItem.speaker}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Stream Notice */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
            <span className="font-semibold text-blue-800">LIVE</span>
          </div>
          <p className="mt-1 text-sm text-blue-700">
            This presentation is being streamed live. You can interact with the speakers during the
            Q&A session. Use the Q&A page to submit your questions!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
