export function calculateTemporalDiff(datetime: Date): number {
    const now = new Date();
    const diffInMs = datetime.getTime() - now.getTime();

    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}