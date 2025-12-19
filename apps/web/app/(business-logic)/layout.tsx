"use client";


import { useAppStore } from "@/lib/redux/hooks";
import React, { useEffect } from "react";

const BusinessLogicLayout = ({ children }: { children: React.ReactNode }) => {

    const store = useAppStore();

    useEffect(() => {
        let previousFileOpsQueueState = JSON.stringify(store.getState().fileOperations);

        const unsubscribe = store.subscribe(() => {
            const currentFileOpsQueueState = JSON.stringify(store.getState().fileOperations);

            if (currentFileOpsQueueState !== previousFileOpsQueueState) {
                localStorage.setItem("fileops", currentFileOpsQueueState);
                previousFileOpsQueueState = currentFileOpsQueueState;
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <React.Fragment>
        {children}
    </React.Fragment>
}

export default BusinessLogicLayout;