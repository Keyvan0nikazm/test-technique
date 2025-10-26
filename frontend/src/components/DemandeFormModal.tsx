import { Modal, Form, Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Demande } from '../types';

const { RangePicker } = DatePicker;

type Props = {
  open: boolean;
  onCancel: () => void;
  onCreate: (data: Partial<Demande>) => void;
};

export default function DemandeFormModal({ open, onCancel, onCreate }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Nouvelle demande de stage"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields().then(values => {
          const [dateDebut, dateFin] = values.periode;
          onCreate({
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            service: values.service,
            dateDebut: dayjs(dateDebut).toISOString(),
            dateFin: dayjs(dateFin).toISOString(),
            motivation: values.motivation,
          });
          form.resetFields();
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
        <Form.Item name="periode" label="Période (début - fin)" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item name="motivation" label="Motivation" rules={[]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}