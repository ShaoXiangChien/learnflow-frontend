import { Video, Quiz } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getVideos(): Promise<Video[]> {
  const response = await fetch(`${API_BASE_URL}/api/videos`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export async function getVideo(id: string): Promise<Video> {
  const response = await fetch(`${API_BASE_URL}/api/videos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch video');
  }
  return response.json();
}

export async function getQuiz(videoId: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}/quiz`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }
  return response.json();
}

export async function generateQuiz(videoId: string, transcript: string, language: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_id: videoId,
      transcript,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }
  return response.json();
}

export async function translateWord(
  text: string,
  fromLang: string,
  toLang: string
): Promise<{ translation: string; pronunciation?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      from_lang: fromLang,
      to_lang: toLang,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to translate');
  }
  return response.json();
}
