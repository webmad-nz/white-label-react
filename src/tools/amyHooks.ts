import { Amy } from "@amy-app/amy-app-js-sdk/dist/src/Amy";
import { useEffect, useState } from "react";

export function useReady(amy: Amy) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (amy) {
            amy.readyObserver((_ready) => setReady(_ready));
        }
    }, [amy]);
    return ready;
}
