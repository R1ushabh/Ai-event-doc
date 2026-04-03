import { LayoutDashboard, Zap, Star, LayoutTemplate, HelpCircle, Heart, Globe, Users, Trophy, Music, Presentation } from 'lucide-react';

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  tags: string[];
  defaultValues: Record<string, any>;
  promptInstructions: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'vibrant_festival',
    title: 'Vibrant Festival',
    description: 'High-energy, community-focused celebrations with a colorful and dynamic vibe.',
    icon: Music,
    color: 'rose',
    tags: ['Energetic', 'Community', 'Colorful'],
    defaultValues: {
      event_type: 'Festival',
      activities: 'Live performances, food stalls, interactive art, community games',
      theme: 'Unity, Joy, and Cultural Celebration',
      event_mode: 'offline'
    },
    promptInstructions: 'The tone should be high-energy, exciting, and welcoming. Use vibrant language. Focus on performance schedules, stage management, audience engagement activities, and hospitality logistics. The flyer should feel like a celebration. The proposal should emphasize community impact and joy.'
  },
  {
    id: 'elegant_gala',
    title: 'Elegant Gala',
    description: 'Formal, high-end events for awards, fundraising, or prestigious celebrations.',
    icon: Star,
    color: 'amber',
    tags: ['Formal', 'Premium', 'Awards'],
    defaultValues: {
      event_type: 'Gala Dinner',
      activities: 'Red carpet, awards ceremony, keynote speech, formal dinner',
      theme: 'Excellence, Prestige, and Recognition',
      event_mode: 'offline'
    },
    promptInstructions: 'The tone should be sophisticated, formal, and prestigious. Use refined language. Focus on the red carpet experience, awards categories, keynote speaker profiles, and a formal multi-course dinner agenda. The flyer should look like a luxury invitation. The proposal should emphasize prestige and high-end logistics.'
  },
  {
    id: 'tech_summit',
    title: 'Corporate Tech Summit',
    description: 'Professional, forward-thinking events focused on innovation and networking.',
    icon: Zap,
    color: 'blue',
    tags: ['Professional', 'Innovation', 'Networking'],
    defaultValues: {
      event_type: 'Tech Summit',
      activities: 'Keynote talks, panel discussions, networking tracks, exhibition',
      theme: 'Future of Technology and Industry Innovation',
      event_mode: 'offline'
    },
    promptInstructions: 'The tone should be professional, innovative, and forward-looking. Use industry-standard terminology. Focus on multiple session tracks, panel discussions, guest faculty, paper presentations, and a formal report structure. Emphasize networking opportunities and industry trends.'
  },
  {
    id: 'workshop',
    title: 'Hands-on Workshop',
    description: 'Educational and practical sessions with specific participant outcomes.',
    icon: Presentation,
    color: 'indigo',
    tags: ['Educational', 'Practical', 'Learning'],
    defaultValues: {
      event_type: 'Workshop',
      activities: 'Hands-on training, Q&A, practical exercises, certification',
      theme: 'Skill Development and Mastery',
      event_mode: 'offline'
    },
    promptInstructions: 'The tone should be educational, encouraging, and clear. Focus on learning objectives, hands-on sessions, participant outcomes, and certificate details. Include a section for trainer expertise and a step-by-step learning path.'
  },
  {
    id: 'hackathon',
    title: 'Creative Hackathon',
    description: 'Competitive problem-solving events focused on rapid prototyping and innovation.',
    icon: Trophy,
    color: 'orange',
    tags: ['Competitive', 'Innovation', 'Prototyping'],
    defaultValues: {
      event_type: 'Hackathon',
      activities: 'Coding sprint, mentoring, project showcase, judging',
      theme: 'Rapid Innovation and Creative Problem Solving',
      event_mode: 'offline'
    },
    promptInstructions: 'The tone should be intense, creative, and competitive. Focus on the problem statement, judging criteria, team participation rules, mentor availability, and prize details. Emphasize the "sprint" nature of the event.'
  },
  {
    id: 'webinar',
    title: 'Community Webinar',
    description: 'Digital-first events designed for broad accessibility and remote learning.',
    icon: Globe,
    color: 'emerald',
    tags: ['Digital', 'Remote', 'Accessible'],
    defaultValues: {
      event_type: 'Webinar',
      activities: 'Live stream, digital Q&A, screen sharing, recording',
      theme: 'Knowledge Access and Global Connection',
      event_mode: 'online'
    },
    promptInstructions: 'The tone should be accessible, informative, and digital-friendly. Focus on the online platform, registration links, speaker bios for digital display, and remote participation instructions. Emphasize the ease of access.'
  },
  {
    id: 'custom',
    title: 'Custom Template',
    description: 'A blank slate to create your own unique event document structure.',
    icon: LayoutTemplate,
    color: 'slate',
    tags: ['Flexible', 'Unique', 'Custom'],
    defaultValues: {
      event_type: '',
      activities: '',
      theme: '',
      event_mode: 'offline'
    },
    promptInstructions: 'Follow the user\'s specific instructions strictly. Be flexible and adapt to the unique requirements provided in the description. Maintain a professional yet adaptable tone.'
  }
];
