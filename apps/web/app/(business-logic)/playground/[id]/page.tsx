"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles } from "@/services";
import { useParams } from "next/navigation";
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

const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const { resolvedTheme } = useTheme();

  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } =
    useSelectedPlaygroundInfo();


  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [areTemplateFileUpdated, SetAreTemplateFileUpdated] = useState<boolean>(false);
  const monacoRef = useRef<Monaco>(null);
  const editoRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>();

  const { globallySelectedFile, allgloballySelectedFile } = useGlobalSelectedFile();

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);

      updateSelectedPlaygroundFn(res.playground);
      sortTemplateTree(res.files.content.items);
      updatePlaygroundTemplateFiles(res.files.content);
      SetAreTemplateFileUpdated(true);
    }

    fetchData();

    return () => {
      updatePlaygroundTemplateFiles(null);
    };
  }, [id]);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    editoRef.current = editor;
    setIsMonacoReady(true);
  }, [])

  const handleEditorOnChange = (value: string | undefined) => {
    if (!value|| !globallySelectedFile) return;

     
  }

  useEffect(() => {
    console.log(isMonacoReady)
    console.log(areTemplateFileUpdated)

    if (!monacoRef.current) return;
    if (!templatePlaygroundSelector) return;

    createMonacoModelsFromTemplateFiles(templatePlaygroundSelector, monacoRef.current);
  }, [isMonacoReady, areTemplateFileUpdated])


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
    if (!globallySelectedFile) return;

    const ModifiedFile = allgloballySelectedFile[globallySelectedFile];

    if (!ModifiedFile) return;

    openFileInEditor(editoRef.current, monacoRef.current, ModifiedFile?.path, ModifiedFile.file);

  }, [globallySelectedFile])

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
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger
              onClick={() => setSidebarWidth(sidebarWidth === 0 ? 260 : 0)}
            />
            <h1 className="text-sm font-medium">
              {selectedPlayground?.title || "Code Playground"}
            </h1>
          </header>
          <GloballySelectedFiles />
          <div className="mt-[1px] flex-1 min-h-0">
            <Editor
              onMount={handleEditorMount}
              defaultLanguage="typescript"
              language="typescript"
              theme={resolvedTheme == 'dark' ? "repl-dark" : "repl-light"}
              beforeMount={handleEditorBeforeMount}
              onChange={handleEditorOnChange} />

          </div>

        </div>
      </div>
    </TooltipProvider>
  );
};

export default Playground;