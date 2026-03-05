import { Monaco } from "@monaco-editor/react";

export const handleEditorBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme(
        "repl-dark",
        {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#000000",
                "editor.foreground": "#E5E7EB",

                // gutter / line numbers
                "editorLineNumber.foreground": "#6B7280",
                "editorLineNumber.activeForeground": "#E5E7EB",

                // cursor & selection
                "editorCursor.foreground": "#F97316",
                "editor.selectionBackground": "#1F2937",
                "editor.inactiveSelectionBackground": "#111827",

                // minimap, scrollbar, etc (optional)
                "scrollbarSlider.background": "#37415180",
                "scrollbarSlider.hoverBackground": "#4B556380",
            }
        }
    );

    monaco.editor.defineTheme("repl-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#FFFFFF",
            "editor.foreground": "#111827",

            "editorLineNumber.foreground": "#9CA3AF",
            "editorLineNumber.activeForeground": "#111827",

            "editorCursor.foreground": "#2563EB",
            "editor.selectionBackground": "#DBEAFE",
            "editor.inactiveSelectionBackground": "#E5E7EB",

            "scrollbarSlider.background": "#D1D5DB80",
            "scrollbarSlider.hoverBackground": "#9CA3AF80",
        },
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    const sharedCompilerOptions = {
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
        lib: ["es2022", "dom", "dom.iterable"],
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(sharedCompilerOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(sharedCompilerOptions);

    fetch("https://unpkg.com/@types/react@18/index.d.ts")
        .then(res => res.text())
        .then(types => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                types,
                "file:///node_modules/@types/react/index.d.ts"
            );
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
                types,
                "file:///node_modules/@types/react/index.d.ts"
            );
        });
};



export const getEditorLanguage = (fileExtension: string): string => {
    const extension = fileExtension.toLowerCase();
    const languageMap: Record<string, string> = {
        // JavaScript/TypeScript
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        mjs: "javascript",
        cjs: "javascript",

        // Web languages
        json: "json",
        html: "html",
        htm: "html",
        css: "css",
        scss: "scss",
        sass: "scss",
        less: "less",

        // Markup/Documentation
        md: "markdown",
        markdown: "markdown",
        xml: "xml",
        yaml: "yaml",
        yml: "yaml",

        // Programming languages
        py: "python",
        python: "python",
        java: "java",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        php: "php",
        rb: "ruby",
        go: "go",
        rs: "rust",
        sh: "shell",
        bash: "shell",
        sql: "sql",

        // Config files
        toml: "ini",
        ini: "ini",
        conf: "ini",
        dockerfile: "dockerfile",
    };

    return languageMap[extension] || "plaintext";
};