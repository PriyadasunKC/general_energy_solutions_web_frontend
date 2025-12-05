// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]): string =>
    classes.filter(Boolean).join(' ');

export { cn };