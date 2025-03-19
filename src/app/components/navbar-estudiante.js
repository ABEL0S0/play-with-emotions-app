import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import Link from 'next/link';

export default function Navbarestudiante() {
  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => window.location.href = '/estudiante',
    },
    {
      label: 'Cursos Completados',
      icon: 'pi pi-book',
      command: () => window.location.href = '/estudiante/certificados',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => window.location.href = '/perfil',
    },
  ];

  const start = (
    <div>
      <Link href="/estudiante">
        <img src="/images/Logo.png" alt="Logo" height={250} width={250} />
      </Link>
    </div>
  );

  const end = (
    <div className="flex align-items-center">
      <span className="me-3">Usuario</span>
      <Avatar icon="pi pi-user" size="large" shape="circle" />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
