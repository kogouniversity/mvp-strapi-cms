import { ZodError, z } from 'zod';

export function validatePassword(password: string) {
    try {
        z.string().min(8, 'Password must be at least 8 characters.').parse(password);
        z.string()
            .refine(s => !s.includes(' '), 'Password must not include a whitespace.')
            .parse(password);
        z.string()
            .refine(
                s => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(s),
                'Password must contain one uppercase letter, one number, and one special character.',
            )
            .parse(password);
    } catch (err) {
        throw new Error((err as ZodError).issues[0].message);
    }
}

export function validateEmailFormat(email: string): void {
    const validateEmail = (emailToValidate: string) =>
        String(emailToValidate)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    if (!validateEmail(email)) throw new Error('Invalid email format.');
}
