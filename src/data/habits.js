export const INTERVAL_OPTIONS = [1, 15, 20, 30, 45, 60, 90];

export const HABITS = [
  {
    id: 'stretch',
    name: 'Estirarse',
    description: 'Parate y estirá el cuerpo',
    icon: '🧘',
    defaultInterval: 45,
    defaultEnabled: true,
  },
  {
    id: 'water',
    name: 'Tomar agua',
    description: 'Un vaso de agua',
    icon: '💧',
    defaultInterval: 30,
    defaultEnabled: true,
  },
  {
    id: 'eyes',
    name: 'Descanso visual',
    description: 'Mirá algo lejano por 20 segundos',
    icon: '👁️',
    defaultInterval: 20,
    defaultEnabled: true,
  },
  {
    id: 'posture',
    name: 'Postura',
    description: 'Chequeá tu espalda y hombros',
    icon: '🪑',
    defaultInterval: 60,
    defaultEnabled: true,
  },
  {
    id: 'breathe',
    name: 'Respiración',
    description: '1 minuto de respiración consciente',
    icon: '🌬️',
    defaultInterval: 90,
    defaultEnabled: false,
  },
  {
    id: 'walk',
    name: 'Caminar',
    description: 'Dá unos pasos, aunque sea al baño',
    icon: '🚶',
    defaultInterval: 60,
    defaultEnabled: false,
  },
];
