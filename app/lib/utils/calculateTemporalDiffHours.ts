export function calculateTemporalDiffHours(datetime: Date): number {
    const now = new Date();
    datetime.setHours(datetime.getHours() - (new Date().getTimezoneOffset() / 60));
    const diffInMs = (now.getTime()) - datetime.getTime();

    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    // console.log('diff', diffInHours);

    // console.log('date', datetime);
    if (datetime.getFullYear() === 1969) return 0;

    return diffInHours;
}