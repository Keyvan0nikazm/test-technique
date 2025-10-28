import { Modal, Form, Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Demande } from '../types';
import { useState } from 'react';

const { RangePicker } = DatePicker;

type Props = {
  open: boolean;
  onCancel: () => void;
  onCreate: (data: Partial<Demande>) => Promise<void>;
};

export default function DemandeFormModal({ open, onCancel, onCreate }: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      title="Nouvelle demande de stage"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={submitting}
      onOk={() => {
        form.validateFields().then(async values => {
          const [dateDebut, dateFin] = values.periode;
          const payload: Partial<Demande> = {
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            service: values.service,
            dateDebut: dayjs(dateDebut).toISOString(),
            dateFin: dayjs(dateFin).toISOString(),
            motivation: values.motivation,
          };
          setSubmitting(true);
          try {
            await onCreate(payload);
            // parent is responsible for closing modal (on success it sets open=false)
            form.resetFields();
          } finally {
            setSubmitting(false);
          }
        }).catch(() => {
          // validation errors - nothing to do here (AntD shows field errors)
        });
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="service" label="Service" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Cardiologie">Cardiologie</Select.Option>
            <Select.Option value="Urgences">Urgences</Select.Option>
            <Select.Option value="Pédiatrie">Pédiatrie</Select.Option>
            <Select.Option value="IT">IT</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="periode"
          label="Période (début - fin)"
          rules={[
            { required: true, message: 'La période est requise' },
            {
              validator: (_, value) => {
                if (!value || !value[0] || !value[1]) return Promise.resolve();
                const [start, end] = value;
                if (dayjs(end).isBefore(dayjs(start))) {
                  return Promise.reject(new Error('La date de fin doit être après la date de début'));
                }
                if (dayjs(start).isBefore(dayjs().startOf('day'))) {
                  return Promise.reject(new Error('La date de début ne peut pas être dans le passé'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item name="motivation" label="Motivation" rules={[]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}