import { Icon } from '@iconify/react';
import messageSquareFill from '@iconify/icons-eva/message-square-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'SpeciaAI',
    path: '/dashboard/specia',
    icon: getIcon(messageSquareFill)
  }
];

export default sidebarConfig;
