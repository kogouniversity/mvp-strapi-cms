import { z, ZodError } from 'zod';

const schema = z.object({
    code: z.string(),
});

/**
 * `validation` middleware
 */

export default () =>
    // Add your own logic here.
    async (ctx, next) => {
        try {
            schema.parse(ctx.request.body);
        } catch (error) {
            if (error instanceof ZodError) {
                return ctx.send(
                    {
                        error: {
                            status: 400,
                            name: 'ValidationError',
                            message: error.issues.reduce((acc, curr) => `${acc}\n${curr.message}`, ''),
                            details: error.issues,
                        },
                    },
                    400,
                );
            }
            throw error;
        }
        return next();
    };
