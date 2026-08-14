// Íconos de línea dibujados a mano (sin librería externa, cero KB de
// dependencia) — reemplazan los emojis decorativos y de estado en todo el
// sitio. viewBox 0 0 24 24, trazo medio (~1.7) redondeado, un solo color
// de acento en todo el sitio. Cada uno lleva un pequeño detalle con
// carácter (el pin con la punta abierta, la caja con el pliegue, el
// triángulo con el gancho) en vez de una forma geométrica perfecta —
// inspirado en la referencia de diseño que definió esta dirección.
// Pensados para insertarse con set:html dentro de un
// <span class="icono-linea">.
export const iconos = {
  buscar: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><line x1="15" y1="15" x2="20" y2="20"/><path d="M7.5 8c-1.3.5-1.8 2-.8 2.8"/></svg>',
  contribuir: '<svg viewBox="0 0 24 24"><path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.2 12 20 12 20Z"/></svg>',
  directorio: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5 13 13l-4.5 2 2.5-4.5Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21c-3-3-7-8.3-7-12a7 7 0 0 1 14 0c0 3.5-3.5 8-6.6 11.6"/><circle cx="12" cy="9" r="2.4"/></svg>',
  urgente: '<svg viewBox="0 0 24 24"><line x1="2" y1="11" x2="4.3" y2="10.2"/><line x1="2.6" y1="13.3" x2="4.9" y2="12.5"/><path d="M6 12.3 19 6l-5.5 13-2-5.5-5.5-1.2Z"/></svg>',
  material: '<svg viewBox="0 0 24 24"><path d="M4 8 12 4l8 4-8 4-8-4Z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M12 12v8"/><path d="M16 6 14.3 7.3 16 8.6"/></svg>',
  acompanamiento: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5"/><circle cx="17" cy="9" r="2.3"/><path d="M15 14.2c.6-.2 1.3-.3 2-.3 2.5 0 4.3 1.8 4.3 4.7"/></svg>',
  check: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.3 10.6 15 16 9"/></svg>',
  reloj: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.2 1.8"/></svg>',
  alerta: '<svg viewBox="0 0 24 24"><path d="M12 3 21 18H3.5c-.9 0-1.3-.8-.6-1.4"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="15.3" r="0.9" fill="currentColor" stroke="none"/></svg>',
  enlace: '<svg viewBox="0 0 24 24"><path d="M10 14.5a3.7 3.7 0 0 0 5.3 0l2.7-2.7a3.7 3.7 0 0 0-5.3-5.3l-1 1"/><path d="M14 9.5a3.7 3.7 0 0 0-5.3 0l-2.7 2.7a3.7 3.7 0 0 0 5.3 5.3l1-1"/></svg>',
};
