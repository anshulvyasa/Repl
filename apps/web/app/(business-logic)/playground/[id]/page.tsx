"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Editor, { Monaco, OnMount } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { getEditorLanguage, handleEditorBeforeMount } from "@/lib/editor/config";
import { useGlobalSelectedFile } from "@/lib/redux/selectoranddispatcher/useGlobalSelectedFile";
import { GloballySelectedFiles } from "@/components/files/render-selected-files";
import { createMonacoModelsFromTemplateFiles, generateFilePath } from "@/lib/editor/models";
import * as monaco from 'monaco-editor';
import { TemplateFile } from "@repo/zod/files";
import { readSelectedFilesFromLocalStorage } from "@/lib/redux/middleware";
import { useTerminal } from "@/hooks/custom-hooks/terminal/use-Terminal";
import { WebContainer } from "@webcontainer/api";
import { getWebContainerInstance } from "@/lib/webcontainer";
import { ExternalLink, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShell } from "@/hooks/custom-hooks/terminal/use-shell";
import { toast } from "sonner";
import { WriteStream } from "node:fs";

const DUMMY_MODEL_URI = "file:///dummy";
const DUMMY_MODEL_CONTENT = "Welcome to repl. select files in order to get started"

const Playground = () => {
  const { resolvedTheme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const monacoRef = useRef<Monaco>(null);
  const editoRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>();


  // Defining Terminal Hooks
  const { containerRef, terminal } = useTerminal({ theme: resolvedTheme == "dark" ? "dark" : "light" });
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  useShell({ terminal, webContainer: webContainer });


  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const { templatePlaygroundSelector } = useTemplatePlayground();
  const { selectedPlayground } = useSelectedPlaygroundInfo();
  const { globallySelectedFile, allgloballySelectedFile, updateContentOfGlobalSelectedFile, initializeIntialStateOfSelectedFiles } = useGlobalSelectedFile();



  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    editoRef.current = editor;
    setIsMonacoReady(true);

    const dummyUri = monaco.Uri.parse(DUMMY_MODEL_URI);
    if (!monaco.editor.getModel(dummyUri)) {
      monaco.editor.createModel(DUMMY_MODEL_CONTENT, "plaintext", dummyUri);
    }
  }, [])

  const handleEditorOnChange = (value: string | undefined) => {
    if (!value || !globallySelectedFile) return;
  }

  const openFileInEditor = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco, path: string[], file: TemplateFile) => {
    const initialPath = generateFilePath(path, file);
    const uri = monaco.Uri.parse(`file://${initialPath}`);
    const model = monaco.editor.getModel(uri);

    if (!model) {
      console.error("Model not found for", uri);
      return;
    }

    const language = getEditorLanguage(file.fileExtension || "");
    monaco.editor.setModelLanguage(model, language);
    editor.setModel(model);
  }, []);


  useEffect(() => {
    if (!monacoRef.current) return;
    if (!templatePlaygroundSelector || !selectedPlayground) return;

    createMonacoModelsFromTemplateFiles(templatePlaygroundSelector, monacoRef.current);

    const parsedData = readSelectedFilesFromLocalStorage(selectedPlayground?.id);
    if (!parsedData) return;

    initializeIntialStateOfSelectedFiles(parsedData);
  }, [isMonacoReady])


  useEffect(() => {
    if (!monacoRef.current || !editoRef.current) return;

    if (!globallySelectedFile) {
      const dummyUri = monacoRef.current.Uri.parse(DUMMY_MODEL_URI);
      const dummyModel = monacoRef.current.editor.getModel(dummyUri);
      if (dummyModel) {
        editoRef.current.setModel(dummyModel);
        editoRef.current.updateOptions({ readOnly: true });
      }
      return;
    }

    editoRef.current.updateOptions({ readOnly: false });

    const ModifiedFile = allgloballySelectedFile[globallySelectedFile];
    if (!ModifiedFile) return;
    openFileInEditor(editoRef.current, monacoRef.current, ModifiedFile?.path, ModifiedFile.file);

  }, [globallySelectedFile, isMonacoReady]);

  // For The Web Container and Terminal
  useEffect(() => {
    console.log("Template File Selector is  inside page.tsx", templatePlaygroundSelector)

    const run = async () => {
      const webContainerInstance = await getWebContainerInstance();
      setWebContainer(webContainerInstance);   // Setting up Refrance

      toast.success("Installing Dependencies");
      const installProcess = await webContainerInstance.spawn("npm", ["install"], {
        cwd: templatePlaygroundSelector?.folderName
      });

      await installProcess.exit;
      // TODO if Install is Failed DO Something Future Works
      toast.success("Dependecies Installed");

      webContainerInstance.on("server-ready", (port, url) => {
        console.log("Url is ", url)
        console.log("Port is ", port)
        setPreviewUrl(url)
      })

      const res = await webContainerInstance.spawn("npm", ["run", "dev"],
        {
          cwd: templatePlaygroundSelector?.folderName
        }
      )

      res.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("The OutPut of NPM run DEV is ", chunk);
          }
        })
      );
    }
    run();
  }, [])


  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <TemplateFileTree
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />

        <div className={cn("flex flex-1 flex-col min-w-0 overflow-hidden")}>
          <header className="flex h-16 items-center gap-2 border-b px-4 shrink-0">
            <SidebarTrigger
              onClick={() => setSidebarWidth(sidebarWidth === 0 ? 260 : 0)}
            />
            <h1 className="text-sm font-medium">
              {selectedPlayground?.title || "Code Playground"}
            </h1>
          </header>

          <GloballySelectedFiles />

          <div className="relative flex flex-1 min-h-0">

            <div className="flex flex-1 flex-col border-r min-w-0">
              <div className="mt-[1px] flex-1 min-h-0">
                <Editor
                  onMount={handleEditorMount}
                  defaultLanguage="typescript"
                  language="typescript"
                  theme={resolvedTheme == 'dark' ? "repl-dark" : "repl-light"}
                  beforeMount={handleEditorBeforeMount}
                  onChange={handleEditorOnChange}
                />
              </div>
              <div
                ref={containerRef}
                className="h-64 w-full shrink-0 border-t p-2"
              />
            </div>

            <div
              className={cn(
                "flex flex-col bg-background min-w-0 transition-all duration-200 ease-in-out",
                isPreviewExpanded
                  ? "absolute inset-0 z-50 h-full w-full border-l-0" // Stretches over the editor
                  : "relative flex-1" // Sits side-by-side
              )}
            >

              <div className="flex h-10 items-center justify-between border-b px-3 bg-muted/30 shrink-0">
                <span className="text-xs font-medium text-muted-foreground">Preview</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={!previewUrl}
                    asChild
                  >
                    <a
                      href={`/preview?url=${encodeURIComponent(previewUrl || '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                  >
                    {isPreviewExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 relative overflow-hidden flex flex-col">
                {/* DEBUGGING BAR
                <div className="bg-yellow-500/20 text-yellow-500 text-xs p-1">
                  Debug URL: {previewUrl ? previewUrl : "NULL"}
                </div> */}
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="flex-1 h-full w-full border-0 bg-white"
                    title="WebContainer Preview"
                    allow="cross-origin-isolated"
                    onError={(e) => console.error("Iframe error:", e)}
                  />
                ) : (
                  <div className="flex flex-1 items-center justify-center text-zinc-500">
                    <p>Waiting for dev server to start...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Playground;