import { WebContainer } from "@webcontainer/api"
import { Terminal } from "@xterm/xterm"
import { RefObject } from "react";

interface ExecuteTerminalCommandProps {
    webContainer: WebContainer
    terminal: Terminal
    command: string;
    commandHistoryRef: RefObject<string[]>;
    historyIndex: RefObject<number>;
}

export const executeTerminalCommand = async ({ webContainer, command, terminal, commandHistoryRef, historyIndex }: ExecuteTerminalCommandProps) => {

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


        const parts = command.trim().split(' ');
        const cmd = parts[0] as string;
        const args = parts[1] ;

        terminal.writeln("");
        // const process = await webContainer.spawn(cmd, args, {
        //     terminal: {
        //         rows: terminal.rows,
        //         cols: terminal.cols
        //     }
        // })
    }
    catch (error) {
        terminal.write(`\r\nCommand Not Found ${command}`)
    }
}