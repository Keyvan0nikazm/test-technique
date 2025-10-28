import axios from 'axios';
import type { Demande } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

export async function fetchDemandes(): Promise<Demande[]> {
  const res = await api.get<Demande[]>('/intership');
  return res.data;
}

export async function createDemande(payload: Partial<Demande>): Promise<Demande> {
  const res = await api.post<Demande>('/intership', payload);
  return res.data;
}

export async function updateDemandeStatus(id: number, status: string): Promise<Demande> {
  const res = await api.patch<Demande>(`/intership/${id}/status`, { status });
  return res.data;
}

export default api;