export function debounce<T>(
    func: (...args: T[]) => unknown,
    delay = 200
): typeof func {
    let timeout: number | NodeJS.Timeout;
    return function (...args: T[]) {
        clearTimeout(timeout as number);
        timeout = setTimeout(() => func(...args), delay);
    };
}

export const throttle = (func: Function, limit: number = 100) => {
    let flag = true;
    return function (this: any, ...args: any[]) {
        if (flag) {
            func.apply(this, arguments);
            flag = false;
            setTimeout(() => flag = true, limit);
        }
    }
};
