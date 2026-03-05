import { useCallback, useRef, useState } from "react"
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const terminalThemes = {
    dark: {
        background: "#09090B",
        foreground: "#FAFAFA",
        cursor: "#FAFAFA",
        cursorAccent: "#09090B",
        selection: "#27272A",
        black: "#18181B",
        red: "#EF4444",
        green: "#22C55E",
        yellow: "#EAB308",
        blue: "#3B82F6",
        magenta: "#A855F7",
        cyan: "#06B6D4",
        white: "#F4F4F5",
        brightBlack: "#3F3F46",
        brightRed: "#F87171",
        brightGreen: "#4ADE80",
        brightYellow: "#FDE047",
        brightBlue: "#60A5FA",
        brightMagenta: "#C084FC",
        brightCyan: "#22D3EE",
        brightWhite: "#FFFFFF",
    },
    light: {
        background: "#FFFFFF",
        foreground: "#18181B",
        cursor: "#18181B",
        cursorAccent: "#FFFFFF",
        selection: "#E4E4E7",
        black: "#18181B",
        red: "#DC2626",
        green: "#16A34A",
        yellow: "#CA8A04",
        blue: "#2563EB",
        magenta: "#9333EA",
        cyan: "#0891B2",
        white: "#F4F4F5",
        brightBlack: "#71717A",
        brightRed: "#EF4444",
        brightGreen: "#22C55E",
        brightYellow: "#EAB308",
        brightBlue: "#3B82F6",
        brightMagenta: "#A855F7",
        brightCyan: "#06B6D4",
        brightWhite: "#FAFAFA",
    },
};

export const useTerminal = ({ theme = "dark" }: { theme: "dark" | "light" }) => {
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const terminalRef = useRef<Terminal | null>(null);
    const resizeObserveRef = useRef<ResizeObserver | null>(null);

    const containerRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const term = new Terminal({
                cursorBlink: true,
                convertEol: true,
                theme: terminalThemes[theme],
                fontSize: 14,
                lineHeight: 1.2,
                letterSpacing: 0,
                allowTransparency: false,
            })

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);

            term.open(node)
            setTimeout(() => fitAddon.fit(), 100)

            const resizeObserver = new ResizeObserver(() => {
                window.requestAnimationFrame(() => fitAddon.fit())
            })
            resizeObserver.observe(node);

            resizeObserveRef.current = resizeObserver;
            terminalRef.current = term;

            setTerminal(term)
        }
        else {
            if (resizeObserveRef.current) {
                resizeObserveRef.current.disconnect();
                resizeObserveRef.current = null
            }

            if (terminalRef.current) {
                terminalRef.current.dispose();
                terminalRef.current = null
            }

            setTerminal(null);
        }
    }, [])

    return { containerRef, terminal }
}