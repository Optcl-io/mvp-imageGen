'use client';

import { useState, FormEvent } from 'react';
import { ThumbsUp, ThumbsDown, SendHorizontal } from 'lucide-react';

interface FeedbackFormProps {
  generationId?: string;
}

export default function GenerationFeedbackForm({ generationId }: FeedbackFormProps) {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use the generationId in the submission
      console.log(`Submitting feedback for generation ${generationId || 'unknown'}:`, feedback);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setFeedback('');
    } catch (error) {
      console.error(`Error submitting feedback for generation ${generationId || 'unknown'}:`, error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 text-center bg-green-50 rounded-lg">
        <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <h4 className="mb-1 text-lg font-medium text-gray-900">Thank you for your feedback!</h4>
        <p className="text-sm text-gray-600">Your feedback helps us improve our AI-generated content.</p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setRating(null);
          }}
          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700">How would you rate this generation?</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setRating('positive')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition border rounded-lg ${
              rating === 'positive'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Good
          </button>
          <button
            type="button"
            onClick={() => setRating('negative')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition border rounded-lg ${
              rating === 'negative'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            Needs Improvement
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="feedback" className="block mb-2 text-sm font-medium text-gray-700">
          Additional comments (optional)
        </label>
        <textarea
          id="feedback"
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us what you liked or how we can improve..."
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <SendHorizontal className="w-4 h-4" />
            Submit Feedback
          </>
        )}
      </button>
    </form>
  );
} 