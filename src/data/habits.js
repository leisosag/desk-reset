import { Footprints } from 'lucide-react';
import { Droplets, Eye, Wind, PersonStanding, User } from 'lucide-react';

export const INTERVAL_OPTIONS = [1, 15, 20, 30, 45, 60, 90];

export const HABITS = [
  // — Movimiento —
  {
    id: 'stretch',
    name: 'Estirarse',
    description: 'Parate y estirá el cuerpo',
    icon: PersonStanding,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Movimiento',
  },
  {
    id: 'walk',
    name: 'Caminar',
    description: 'Levantate y caminá un minuto',
    icon: Footprints,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Movimiento',
  },
  {
    id: 'neck',
    name: 'Estiramiento de cuello',
    description: 'Rotá el cuello suavemente',
    icon: Footprints,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Movimiento',
  },

  // — Ojos y cabeza —
  {
    id: 'eyes',
    name: 'Descanso visual',
    description: 'Mirá algo lejano por 20 segundos',
    icon: Eye,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Ojos y cabeza',
  },
  {
    id: 'close-eyes',
    name: 'Cerrar los ojos',
    description: 'Cerrá los ojos 30 segundos',
    icon: Eye,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Ojos y cabeza',
  },
  {
    id: 'headphones',
    name: 'Sacar los auriculares',
    description: 'Dale un descanso a tus oídos',
    icon: Eye,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Ojos y cabeza',
  },

  // — Hidratación y alimentación —
  {
    id: 'water',
    name: 'Tomar agua',
    description: 'Un vaso de agua, ya',
    icon: Droplets,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Hidratación',
  },
  {
    id: 'snack',
    name: 'Tomar un snack',
    description: 'Algo saludable para recargar',
    icon: Droplets,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Hidratación',
  },
  {
    id: 'coffee',
    name: 'Café o té',
    description: 'Un momento para el ritual',
    icon: Droplets,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Hidratación',
  },

  // — Mental —
  {
    id: 'breathe',
    name: 'Respiración',
    description: 'Tres respiraciones profundas',
    icon: Wind,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Mental',
  },
  {
    id: 'pending',
    name: 'Revisar pendientes',
    description: 'Un vistazo rápido a tu lista',
    icon: Wind,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Mental',
  },
  {
    id: 'air',
    name: 'Salir a tomar aire',
    description: 'Dos minutos afuera',
    icon: Wind,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Mental',
  },

  // — Postura —
  {
    id: 'posture',
    name: 'Postura',
    description: 'Chequeá tu espalda y hombros',
    icon: User,
    defaultInterval: 30,
    defaultEnabled: true,
    category: 'Postura',
  },
  {
    id: 'jaw',
    name: 'Relajar la mandíbula',
    description: 'Soltá la tensión de la cara',
    icon: User,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Postura',
  },
  {
    id: 'wrists',
    name: 'Postura de muñecas',
    description: 'Revisá la posición de tus manos',
    icon: User,
    defaultInterval: 30,
    defaultEnabled: false,
    category: 'Postura',
  },
];
