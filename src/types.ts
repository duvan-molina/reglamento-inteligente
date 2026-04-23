export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface RegulationDocument {
  id: string;
  name: string;
  storagePath: string;
  downloadUrl: string;
  extractedText: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface AIInteraction {
  id: string;
  userId: string;
  question: string;
  answer: string;
  documentId: string;
  createdAt: Date;
}
