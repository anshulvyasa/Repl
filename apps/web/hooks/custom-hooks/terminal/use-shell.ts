import { IDisposable, Terminal } from "@xterm/xterm"
import { WebContainer, WebContainerProcess } from '@webcontainer/api'
import { RefObject, useEffect, useRef } from "react"
import { handleTerminalInput } from "@/lib/terminal/terminal-input-handler"

interface useShellProps {
    terminal: Terminal | null
    webContainer: WebContainer | null
    currentLine: RefObject<string>
    cursorPosition: RefObject<number>
    commandHistoryRef: RefObject<string[]>;
    historyIndex: RefObject<number>;
    processRef: RefObject<WebContainerProcess | null>
}

export const useShell = ({ terminal, webContainer, currentLine, cursorPosition, commandHistoryRef, historyIndex, processRef }: useShellProps) => {
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

            onDataDisposable = terminal.onData((data) => handleTerminalInput({ data, terminal, webContainer, currentLine, cursorPosition, commandHistoryRef, historyIndex, processRef }));
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