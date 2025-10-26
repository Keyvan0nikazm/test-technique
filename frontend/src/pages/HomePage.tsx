import { useEffect, useState } from 'react';
import { fetchDemandes, createDemande, updateDemandeStatus } from '../services/api';
import type { Demande, Status } from '../types';
import { message, Layout, Typography } from 'antd';
import DemandesTable from '../components/DemandeTable';
import DemandeFormModal from '../components/DemandeFormModal';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

export default function HomePage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchDemandes();
      setDemandes(res);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('API error response:', err.response);
        message.error(err.response.data?.error || 'Impossible de charger les demandes');
      } else {
        console.error('API error:', err);
        message.error('Impossible de charger les demandes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload: Partial<Demande>) => {
    try {
      const created = await createDemande(payload);
      setDemandes(prev => [created, ...prev]);
      setOpenCreate(false);
      message.success('Demande créée');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        message.error(err.response.data?.error || 'Erreur création');
      } else {
        message.error('Erreur création');
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: Status) => {
    try {
      const updated = await updateDemandeStatus(id, status);
      setDemandes(prev => prev.map(d => (d.id === id ? updated : d)));
      message.success('Statut mis à jour');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        message.error(err.response.data?.error || 'Erreur création');
      } else {
        message.error('Erreur création');
      }
    }
  };

  return (
    <Layout style={{ padding: 15 }}>
      <Content>
        <Title level={3}>Demandes de stage</Title>
        <DemandesTable
          data={demandes}
          onRefresh={load}
          onUpdateStatus={handleUpdateStatus}
          onCreateClick={() => setOpenCreate(true)}
        />
        <DemandeFormModal open={openCreate} onCancel={() => setOpenCreate(false)} onCreate={handleCreate} />
      </Content>
    </Layout>
  );
}