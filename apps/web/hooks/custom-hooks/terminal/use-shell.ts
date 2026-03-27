"use client";

import { WebContainer, WebContainerProcess } from "@webcontainer/api"
import { Terminal, IDisposable } from "@xterm/xterm"
import { useEffect, useRef } from "react"


interface useShellProps {
    terminal: Terminal | null
    webContainer: WebContainer | null
}

export const useShell = ({ terminal, webContainer }: useShellProps) => {
    const isStartedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!terminal || !webContainer || isStartedRef.current) return;
        isStartedRef.current = true;

        let shellProcess: WebContainerProcess | null = null;
        let onDataDisposable: IDisposable | null = null;
        let onResizeDisposable: IDisposable | null = null;

        const startShellProcess = async () => {
            shellProcess = await webContainer.spawn('jsh', {
                terminal: {
                    rows: terminal.rows,
                    cols: terminal.cols
                }
            });


            shellProcess.output.pipeTo(new WritableStream({
                write(data) {
                    terminal.write(data);
                }
            }));

            const inputWriter = shellProcess.input.getWriter();
            onDataDisposable = terminal.onData((data) => {
                inputWriter.write(data);
            })

            onResizeDisposable = terminal.onResize((dims) => {
                shellProcess?.resize({ rows: dims.rows, cols: dims.cols });
            })

        }

        startShellProcess();

        return () => {
            onDataDisposable?.dispose();
            onResizeDisposable?.dispose();
            shellProcess?.kill();
            isStartedRef.current = false;
        }

    }, [terminal, webContainer])
}