export type Status = 'en_attente' | 'acceptee' | 'refusee' | 'annulee';

export interface Demande {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  service: string;
  dateDebut: string; // ISO
  dateFin: string;   // ISO
  motivation?: string | null;
  status: Status;
  createdAt: string;
}