export function getEnv(
    name: string,
    opts?: { required?: boolean; fallback?: string }
    ) {
        const { required = true, fallback } = opts ?? {};
        const val = process.env[name] ?? fallback;
    if (!val && required) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return val ?? '';
}