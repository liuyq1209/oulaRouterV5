import {
  DashboardOutlined,
  FormOutlined,
  BorderlessTableOutlined,
  ProfileOutlined,
  WarningOutlined,
} from '@ht-icons/sprite-ui-react';

const icons = {
  DashboardOutlined,
  WarningOutlined,
  FormOutlined,
  BorderlessTableOutlined,
  ProfileOutlined,
};
export default function (name?: string) {
  return !name ? null : icons[name];
}
