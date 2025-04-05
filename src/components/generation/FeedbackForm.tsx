'use client';

import { useState } from 'react';

interface FeedbackFormProps {
  generationId: string;
}

export default function FeedbackForm({ generationId }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Here you would actually submit the feedback to your API
      console.log(`Submitting feedback for generation ${generationId}:`, feedback);
      
      // Simulate API call - in a real implementation, you would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the form after successful submission
      setFeedback('');
      // You could also show a success message here
    } catch (error) {
      // Handle error
      console.error(`Failed to submit feedback for generation ${generationId}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea 
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        rows={3}
        placeholder="Share your thoughts on this generation..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        disabled={isSubmitting}
      ></textarea>
      
      <button 
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
} 