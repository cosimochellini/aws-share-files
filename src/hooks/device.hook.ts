import { useEffect, useState } from "react";
import { debounce } from "../utils/callbacks";
import { device } from "../services/device.service";

export const useDevice = () => {
    const [state, setState] = useState({ ...device });

    useEffect(() => {
        const handleResize = debounce(() => {
            const currentWindow = device.window;
            if (!currentWindow) return;

            setState({
                ...device,
                hasWidth: (w) => device.hasWidth(w),
            });
        });

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return state;
};
