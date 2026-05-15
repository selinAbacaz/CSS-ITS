export interface ContentSection {
  heading: string;
  body: string;
}

export interface TopicContent {
  intro: string;
  sections: ContentSection[];
  example: string;
}

export interface Topic {
  id: string;
  title: string;
  duration: string;
  content: TopicContent;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  topics: Topic[];
}

export interface Progress {
  opened: Set<string>;
  completed: Set<string>;
}