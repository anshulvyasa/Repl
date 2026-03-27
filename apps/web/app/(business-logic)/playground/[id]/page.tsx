"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildWebContainerFileTree, cn } from "@/lib/utils";
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
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { getWebContainerInstance } from "@/lib/webcontainer";
import { toast } from "sonner";
import { ExternalLink, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShell } from "@/hooks/custom-hooks/terminal/use-shell";

const DUMMY_MODEL_URI = "file:///dummy";
const DUMMY_MODEL_CONTENT = "Welcome to repl. select files in order to get started"

const Playground = () => {
  const { resolvedTheme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const monacoRef = useRef<Monaco>(null);
  const editoRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>();
  const hasMountedFiles = useRef<boolean>(false);
  const webContainerRef = useRef<WebContainer>(null);

  // Defining Terminal Hooks
  const { containerRef, terminal } = useTerminal({ theme: resolvedTheme == "dark" ? "dark" : "light" });
  useShell({ terminal, webContainer: webContainerRef.current });


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

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!templatePlaygroundSelector || !selectedPlayground) return;

    createMonacoModelsFromTemplateFiles(templatePlaygroundSelector, monacoRef.current);

    const parsedData = readSelectedFilesFromLocalStorage(selectedPlayground?.id);
    if (!parsedData) return;

    initializeIntialStateOfSelectedFiles(parsedData);
  }, [isMonacoReady])

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

  useEffect(() => {
    const initWebContainer = async () => {
      if (!templatePlaygroundSelector || hasMountedFiles.current) return;

      try {
        const webcontainer = await getWebContainerInstance();
        if (!webcontainer) {
          toast.error("Error While Creating Web Conatiner Instance");
          return;
        }

        webContainerRef.current = webcontainer;
        const webContainerFileTree: FileSystemTree = {};
        buildWebContainerFileTree(templatePlaygroundSelector, webContainerFileTree);

        await webcontainer.mount(webContainerFileTree);
        hasMountedFiles.current = true;

        webcontainer.on("server-ready", (port, url) => {
          setPreviewUrl(url);
        });

        const installProcess = await webcontainer.spawn('npm', ['install'], {
          cwd: templatePlaygroundSelector.folderName
        });

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error("unable To Install Dependency");
        }

        const devProcess = await webcontainer.spawn('npm', ['run', 'dev'], {
          cwd: templatePlaygroundSelector.folderName
        });

        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("[DEV SERVER]: ", data);
            }
          })
        );

      } catch (error) {
        console.error("WebContainer setup failed", error);
      }
    };

    initWebContainer();

  }, [templatePlaygroundSelector]);

  useEffect(() => {
    if (!terminal || !webContainerRef.current) return;



  }, [terminal, webContainerRef.current])

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
                      rel="noreferrer" // Note: intentionally omitted 'noopener'
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
              <div className="flex-1 relative">
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    title="WebContainer Preview"
                    allow="cross-origin-isolated"
                    // @ts-ignore
                    credentialless="true"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-500">
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