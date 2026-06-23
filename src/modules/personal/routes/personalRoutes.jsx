import { PersonalListPage } from '../pages/PersonalListPage';
import { PersonalProfilePage } from '../pages/PersonalProfilePage';

export const rutasPersonal = [
  {
    path: 'personal',
    children: [
      {
        index: true,
        element: <PersonalListPage />
      },
      {
        path: ':id',
        element: <PersonalProfilePage />
      }
    ]
  }
];
