import { z } from "zod";

// Acceso socio
export const loginSocioSchema = z.object({
  partnerKey: z.string().min(4, "Clave inválida"),
});

// Reserva desde portal socio
export const reservaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().min(8, "Teléfono inválido").optional().or(z.literal("")),
  fecha: z.string().min(1, "Selecciona una fecha"),
  hora: z.string().min(1, "Selecciona una hora"),
  personas: z.number().int().min(1).max(20),
  notas: z.string().max(300).optional(),
});

// Consumo / pedido
export const pedidoSchema = z.object({
  mesa: z.string().min(1, "Indica la mesa"),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      cantidad: z.number().int().min(1),
    })
  ).min(1, "Agrega al menos un ítem"),
  notas: z.string().max(200).optional(),
});

export type LoginSocioFormData = z.infer<typeof loginSocioSchema>;
export type ReservaFormData = z.infer<typeof reservaSchema>;
export type PedidoFormData = z.infer<typeof pedidoSchema>;
