import { z } from 'zod';

export const BrandProfileSchema = z.object({
  niche: z.string().min(1, 'Nicho é obrigatório'),
  subNiche: z.string().nullable().optional(),
  businessType: z.enum(['Local Service', 'SaaS', 'E-commerce', 'Infoproduct', 'Personal Brand', 'Agency/B2B']),
  targetAudience: z.object({
    demographics: z.enum(['B2B', 'B2C']),
    painPoints: z.array(z.string()).max(5).default([]),
    objections: z.array(z.string()).max(5).default([])
  }),
  valueProposition: z.string().min(1, 'Proposta de valor é obrigatória'),
  differentiators: z.array(z.string()).default([]),
  brandArchetype: z.enum(['Inocente', 'Explorador', 'Sábio', 'Herói', 'Fora-da-lei', 'Mago', 'Cara Comum', 'Amante', 'Bobo da Corte', 'Cuidador', 'Criador', 'Governante']),
  personality: z.array(z.enum(['Sério', 'Confiante', 'Discreto', 'Divertido', 'Inovador', 'Tradicional', 'Acolhedor', 'Agressivo'])).default([]),
  toneOfVoice: z.enum(['Autoritário', 'Empático', 'Técnico', 'Descontraído', 'Luxuoso', 'Inspirador']),
  sophisticationLevel: z.enum(['Acessível', 'Padrão', 'Premium', 'Luxo']),
  landingObjectives: z.array(z.string()).min(1),
  mentalTriggers: z.array(z.enum(['Autoridade', 'Prova Social', 'Urgência', 'Escassez', 'Reciprocidade', 'Aversão à Perda', 'Comunidade'])).default([]),
  keywords: z.array(z.string()).default([])
});
