export interface User { id: string; name: string; email: string; }
export interface Resume { id: string; userId: string; fileUrl: string; parsedText: string; atsScore: number | null; createdAt: string; }
export interface Analysis { atsScore: number; keywordScore: number; sectionScore: number; skillScore: number; structureScore: number; semanticScore: number; experienceScore: number; impactScore: number; suggestions: { rewriteTips: string[]; missingKeywords: string[] }; createdAt: string; }
export interface AdzunaJob { id: string; title: string; company: { display_name: string }; location: { display_name: string }; description: string; salary_min?: number; salary_max?: number; redirect_url: string; }
export interface StoredUser { userId: string; name: string; email: string; token: string; }