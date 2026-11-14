import { z } from 'zod';

export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
};

export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
    .object({
        sport: z.string().min(1),
        homeTeam: z.string().min(1),
        awayTeam: z.string().min(1),
        startTime: z.string(),
        endTime: z.string(),
        homeScore: z.number().int().min(0).optional(),
        awayScore: z.number().int().min(0).optional(),
    })
    .refine(
        (data) => {
            const start = new Date(data.startTime);
            const end = new Date(data.endTime);
            return !isNaN(start.getTime()) && !isNaN(end.getTime());
        },
        { message: 'startTime and endTime must be valid ISO date strings' }
    )
    .superRefine((data, ctx) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        if (end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'endTime must be after startTime',
                path: ['endTime'],
            });
        }
    });

export const updateScoreSchema = z.object({
    homeScore: z.number().int().min(0),
    awayScore: z.number().int().min(0),
});