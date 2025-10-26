import React from 'react';
import { Table, Tag, Select, Row, Col, Button, Space } from 'antd';
import type { Demande, Status } from '../types';
import dayjs from 'dayjs';

const statusLabels: Record<Status, { color: string; label: string }> = {
  en_attente: { color: 'orange', label: 'En attente' },
  acceptee: { color: 'green', label: 'Approuvée' },
  refusee: { color: 'red', label: 'Refusée' },
  annulee: { color: 'default', label: 'Annulée' },
};

type Props = {
  data: Demande[];
  onRefresh: () => void;
  onUpdateStatus: (id: number, status: Status) => void;
  onCreateClick: () => void;
};

export default function DemandesTable({ data, onRefresh, onUpdateStatus, onCreateClick }: Props) {
  console.log('DemandeTable data prop:', data);
  const [serviceFilter, setServiceFilter] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  const services = Array.from(new Set(data.map(d => d.service))).filter(Boolean);

  const filtered = data.filter(d =>
    (serviceFilter ? d.service === serviceFilter : true) &&
    (statusFilter ? d.status === statusFilter : true)
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Prénom', dataIndex: 'prenom', key: 'prenom' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    {
      title: 'Période',
      key: 'periode',
      render: (_: unknown, record: Demande) =>
        `${dayjs(record.dateDebut).format('YYYY-MM-DD')} → ${dayjs(record.dateFin).format('YYYY-MM-DD')}`,
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_: unknown, record: Demande) => {
        const s = statusLabels[record.status];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Demande) => (
        <Space>
          <Select
            value={record.status}
            onChange={(val) => onUpdateStatus(record.id, val as Status)}
            style={{ width: 140 }}
            options={[
              { label: 'En attente', value: 'en_attente' },
              { label: 'Approuvée', value: 'acceptee' },
              { label: 'Refusée', value: 'refusee' },
              { label: 'Annulée', value: 'annulee' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Col>
          <Space>
            <Select
              allowClear
              placeholder="Filtrer par service"
              style={{ width: 180 }}
              onChange={(v) => setServiceFilter(v ?? null)}
              options={services.map(s => ({ label: s, value: s }))}
            />
            <Select
              allowClear
              placeholder="Filtrer par statut"
              style={{ width: 180 }}
              onChange={(v) => setStatusFilter(v ?? null)}
              options={[
                { label: 'En attente', value: 'en_attente' },
                { label: 'Approuvée', value: 'acceptee' },
                { label: 'Refusée', value: 'refusee' },
                { label: 'Annulée', value: 'annulee' },
              ]}
            />
            <Button onClick={onRefresh}>Rafraîchir</Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" onClick={onCreateClick}>Nouvelle demande</Button>
        </Col>
      </Row>

      <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />
    </>
  );
}