import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import Link from 'next/link';

export default function Navbarprofesor() {
  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => window.location.href = '/profesor',
    },
    {
      label: 'Progreso Cursos',
      icon: 'pi pi-book',
      command: () => window.location.href = '/profesor/cursos',
    },
    {
      label: 'Juegos Disponibles',
      icon: 'pi pi-game',
      command: () => window.location.href = '/profesor/juegos',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => window.location.href = '/perfil',
    },
  ];

  const start = (
    <div>
      <Link href="/profesor">
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

