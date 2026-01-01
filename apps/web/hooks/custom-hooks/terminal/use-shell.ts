import { IDisposable, Terminal } from "@xterm/xterm"
import { WebContainer, WebContainerProcess } from '@webcontainer/api'
import { useEffect, useRef } from "react"

interface useShellProps {
    terminal: Terminal | null
    webContainer: WebContainer | null
}

export const useShell = ({ terminal, webContainer }: useShellProps) => {
    const refStartShell = useRef<boolean>(false);

    useEffect(() => {
        if (!terminal || !webContainer) return;

        if (refStartShell.current) return;
        refStartShell.current = true;

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

            const input = shellProcess.input.getWriter();

            onDataDisposable = terminal.onData((data) => input.write(data));
            onResizeDisposable = terminal.onResize((dims) =>
                shellProcess?.resize({ rows: dims.rows, cols: dims.cols })
            );
        };

        startShellProcess();

        return () => {
            onDataDisposable?.dispose();
            onResizeDisposable?.dispose();
            shellProcess?.kill();
            refStartShell.current = false;
        };

    }, [terminal, webContainer]);
};