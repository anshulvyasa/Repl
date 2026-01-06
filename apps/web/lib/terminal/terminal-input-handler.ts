import { Terminal } from "@xterm/xterm";
import { executeTerminalCommand } from "./execute-terminal-command";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { RefObject } from "react";

interface TerminalInputHandlerProps {
    data: string;
    terminal: Terminal
    webContainer: WebContainer
    currentLine: RefObject<string>
    cursorPosition: RefObject<number>
    commandHistoryRef: RefObject<string[]>;
    historyIndex: RefObject<number>;
    processRef: RefObject<WebContainerProcess | null>
}


export const handleTerminalInput = ({ data, terminal, currentLine, webContainer, cursorPosition, commandHistoryRef, historyIndex, processRef }: TerminalInputHandlerProps) => {
    switch (data) {
        case '\r':
            executeTerminalCommand({ webContainer, terminal, command: currentLine.current, commandHistoryRef, historyIndex, processRef });
            break;
        case '\u007F': //  This is BackSpace
            if (cursorPosition.current > 0) {
                currentLine.current = currentLine.current.slice(0, cursorPosition.current - 1) + currentLine.current.slice(cursorPosition.current);
                cursorPosition.current--;

                terminal.write('\b \b');
            }
            break;
        case '\u0003':  // This is Ctrl+C
            if (processRef.current) {
                processRef.current.kill();
                processRef.current = null;
            }
            terminal.write('^C');
            break;
        case '\u001b[A':  // up Arrow
            if (commandHistoryRef.current.length > 0) {
                if (historyIndex.current == -1) historyIndex.current = commandHistoryRef.current.length - 1;
                else if (historyIndex.current > 0) historyIndex.current--;

                const historyCommand = commandHistoryRef.current[historyIndex.current];
                terminal.write('\r$ ' + ' '.repeat(currentLine.current.length) + '\r$ ');
                terminal.write(historyCommand as string);
                currentLine.current = historyCommand as string;
                cursorPosition.current = (historyCommand as string).length;
            }
            break;

        case '\u001b[B': // down Arrow
            if (historyIndex.current !== -1) {
                if (historyIndex.current < commandHistoryRef.current.length - 1) {
                    historyIndex.current++;
                    const command = commandHistoryRef.current[historyIndex.current];
                    terminal.write('\r$ ' + ' '.repeat(currentLine.current.length) + "\r$ ");
                    terminal.write(command as string);
                    currentLine.current = command as string;
                    cursorPosition.current = 0;
                }
                else {
                    terminal.write('\r$ ' + ' '.repeat(currentLine.current.length) + "\r$ ");
                    historyIndex.current = -1;
                    currentLine.current = "";
                    cursorPosition.current = 0;
                }
            }
            break;

        default:
            if (data >= " " || data == '\t') {
                currentLine.current = currentLine.current.slice(0, cursorPosition.current) + data + currentLine.current.slice(cursorPosition.current);
                cursorPosition.current++;
                terminal.write(data)
            }
            break;
    }
}