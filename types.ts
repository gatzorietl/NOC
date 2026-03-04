
export enum MessageTone {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  CASUAL = 'Casual',
  APOLOGETIC = 'Apologetic'
}

export interface MessageParts {
  greetings: string[];
  bodies: string[];
  thanks: string[];
  closings: string[];
}

export interface SelectedParts {
  greeting: string;
  body: string;
  thanks: string;
  closing: string;
}

export interface Scenario {
  id: string;
  label: string;
  topic: string;
  icon: string;
}
