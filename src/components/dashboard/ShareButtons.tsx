'use client';

import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Copy, 
  Check
} from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  media?: string;
}

export default function ShareButtons({ url, title, media }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedMedia = media ? encodeURIComponent(media) : '';
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTwitterShare = async () => {
    try {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, '_blank');
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-700 transition rounded-full hover:bg-gray-100"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>
      
      {/* Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-700 transition rounded-full hover:bg-gray-100"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      
      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-700 transition rounded-full hover:bg-gray-100"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      
      {/* Instagram doesn't have a direct share URL, so this would need a different implementation */}
      <button
        className="p-2 text-gray-700 transition rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Share on Instagram"
        title="Instagram sharing requires direct API integration"
        disabled
      >
        <Instagram className="w-5 h-5" />
      </button>
      
      {/* Copy link */}
      <button
        onClick={copyToClipboard}
        className="p-2 text-gray-700 transition rounded-full hover:bg-gray-100"
        aria-label={copied ? "Copied!" : "Copy link"}
      >
        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
      </button>
    </div>
  );
}