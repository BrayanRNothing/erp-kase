// ── Sistema de Traducciones del ERP ──

export const translations = {
  es: {
    // Sidebar
    sidebar: {
      totalAccumulated: 'Total Acumulado',
      linkedAccounts: 'cuentas vinculadas',
      notifications: 'Notificaciones',
      active: 'Activo ahora',
      admin: 'Administrador',
      user: 'Usuario',
      logout: 'Cerrar sesión',
    },
    // Secciones / Menú principal
    sections: {
      reports: 'Reportes',
      movements: 'Movimientos',
      cards: 'Tarjetas',
      billing: 'Crear Factura',
      vault: 'Bóveda Docs',
      clients: 'Clientes/Prov.',
      budgets: 'Presupuestos',
      ai: 'Asistente IA',
      settings: 'Configuración',
      users: 'Usuarios',
    },
    // Notifications
    notifications: {
      paymentConfirmed: 'Pago confirmado',
      received: 'recibidos',
      limitAt: 'Límite al 85%',
      creditCard: 'Tarjeta Crédito *8812',
      invoiceReady: 'Lista para enviar',
      goalReached: 'Meta alcanzada 🎉',
      savedThisMonth: 'Ahorraste 20% este mes',
      yesterday: 'ayer',
    },
    // Placeholder
    placeholder: {
      title: 'En Construcción',
      content: 'Esta sección está en desarrollo y pronto estará disponible.',
    },
    // Settings Section
    settings: {
      tabs: {
        profile: 'Perfil',
        appearance: 'Apariencia',
        security: 'Seguridad',
        notifications: 'Notificaciones',
      },
      profile: {
        title: 'Información del Perfil',
        subtitle: 'Actualiza tus datos personales y detalles de contacto.',
        fullName: 'Nombre Completo',
        email: 'Correo Electrónico',
        currentRole: 'Rol Actual',
        roleNote: 'No tienes permisos para cambiar tu propio rol.',
        save: 'Guardar Cambios',
        saved: 'Guardado',
      },
      appearance: {
        title: 'Apariencia y Sistema',
        subtitle: 'Personaliza cómo se ve y funciona tu ERP.',
        language: 'Idioma del Sistema',
        backgroundUrl: 'Link de Imagen / Video de Fondo',
        backgroundPlaceholder: 'https://ejemplo.com/fondo.mp4',
        backgroundNote: 'Pega la URL de una imagen (.jpg, .png) o un video (.mp4). Los cambios se aplicarán al guardar.',
        preview: 'Vista Previa',
        save: 'Guardar Cambios',
        saved: 'Guardado',
      },
      comingSoon: {
        title: 'Próximamente',
        subtitle: 'Esta sección está en desarrollo. Estará disponible en futuras actualizaciones.',
      },
    },
  },

  en: {
    // Sidebar
    sidebar: {
      totalAccumulated: 'Total Balance',
      linkedAccounts: 'linked accounts',
      notifications: 'Notifications',
      active: 'Active now',
      admin: 'Administrator',
      user: 'User',
      logout: 'Log out',
    },
    // Secciones / Menú principal
    sections: {
      reports: 'Reports',
      movements: 'Movements',
      cards: 'Cards',
      billing: 'Create Invoice',
      vault: 'Doc Vault',
      clients: 'Clients/Prov',
      budgets: 'Budgets',
      ai: 'AI Assistant',
      settings: 'Settings',
      users: 'Users',
    },
    // Notifications
    notifications: {
      paymentConfirmed: 'Payment confirmed',
      received: 'received',
      limitAt: 'Limit at 85%',
      creditCard: 'Credit Card *8812',
      invoiceReady: 'Ready to send',
      goalReached: 'Goal reached 🎉',
      savedThisMonth: 'You saved 20% this month',
      yesterday: 'yesterday',
    },
    // Placeholder
    placeholder: {
      title: 'Under Construction',
      content: 'This section is under development and will be available soon.',
    },
    // Settings Section
    settings: {
      tabs: {
        profile: 'Profile',
        appearance: 'Appearance',
        security: 'Security',
        notifications: 'Notifications',
      },
      profile: {
        title: 'Profile Information',
        subtitle: 'Update your personal information and contact details.',
        fullName: 'Full Name',
        email: 'Email Address',
        currentRole: 'Current Role',
        roleNote: "You don't have permission to change your own role.",
        save: 'Save Changes',
        saved: 'Saved',
      },
      appearance: {
        title: 'Appearance & System',
        subtitle: 'Customize how your ERP looks and behaves.',
        language: 'System Language',
        backgroundUrl: 'Background Image / Video Link',
        backgroundPlaceholder: 'https://example.com/background.mp4',
        backgroundNote: 'Paste the URL of an image (.jpg, .png) or a video (.mp4). Changes will apply on save.',
        preview: 'Preview',
        save: 'Save Changes',
        saved: 'Saved',
      },
      comingSoon: {
        title: 'Coming Soon',
        subtitle: 'This section is under development. It will be available in future updates.',
      },
    },
  },
};

export function getT(language) {
  return translations[language] ?? translations['es'];
}
