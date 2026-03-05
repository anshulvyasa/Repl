import { WebContainer, WebContainerProcess } from "@webcontainer/api"
import { Terminal } from "@xterm/xterm"
import { RefObject } from "react";

interface ExecuteTerminalCommandProps {
    webContainer: WebContainer
    terminal: Terminal
    command: string;
    commandHistoryRef: RefObject<string[]>;
    historyIndex: RefObject<number>;
    processRef: RefObject<WebContainerProcess | null>
}

export const executeTerminalCommand = async ({ webContainer, command, terminal, commandHistoryRef, historyIndex, processRef }: ExecuteTerminalCommandProps) => {

    if (command.trim() && commandHistoryRef.current[commandHistoryRef.current.length - 1] !== command) {
        commandHistoryRef.current.push(command)
    }
    historyIndex.current = -1;

    try {
        if (command.trim() === "clear") {
            terminal.clear();
            return;
        }
        if (command.trim() === "history") {
            commandHistoryRef.current.forEach((cmd, index) => {
                terminal.writeln(` ${index + 1} ${cmd}`);
            })
            return;
        }

        const parts = command.trim().split('/\s+/');
        const cmd = parts[0] as string;
        const args = parts.slice(1).map((arg) => arg.trim());


        terminal.writeln("");
        const process = await webContainer.spawn(cmd, args, {
            terminal: {
                rows: terminal.rows,
                cols: terminal.cols
            }
        })

        processRef.current = process;
    }
    catch (error) {
        terminal.write(`\r\nCommand Not Found ${command}`)
    }
}