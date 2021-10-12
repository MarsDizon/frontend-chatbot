import { Icon } from '@iconify/react';
import archiveFill from '@iconify/icons-eva/archive-fill';
import messageSquareFill from '@iconify/icons-eva/message-square-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'SpeciaAI',
    path: '/dashboard/specia',
    icon: getIcon(messageSquareFill)
  },
  {
    title: 'History',
    path: '/dashboard/history',
    icon: getIcon(archiveFill)
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },
];

export default sidebarConfig;
