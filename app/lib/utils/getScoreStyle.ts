export const getScoreStyle = (score: number = 0) => {
    const percentage = Math.min(Math.max(score, 0), 100);
    return {
        color: `color-mix(in oklab,var(--color-red-400),var(--color-green-500) ${percentage}%)`
    };
};