import { Amy } from "@amy-app/amy-app-js-sdk";
import { useEffect, useState } from "react";

export function useAmyReady(amy: Amy.Amy) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (amy) {
            amy.readyObserver((_ready) => setReady(_ready));
        }
    }, [amy]);
    return ready;
}
