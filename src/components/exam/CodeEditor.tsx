import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

// Import ace builds using dynamic imports for Vite compatibility
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-vbscript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  initialCode?: string;
  value: string;
  onChange: (code: string) => void;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '', 
  value, 
  onChange, 
  language = 'python' 
}) => {
  const editorRef = useRef<any>(null);

  // Map language names to ACE editor modes
  const getEditorMode = (lang: string) => {
    const langMap: Record<string, string> = {
      'python': 'python',
      'javascript': 'javascript',
      'java': 'java',
      'c++': 'c_cpp',
      'c': 'c_cpp',
      'vb': 'vbscript',
      'vbscript': 'vbscript',
      'visualbasic': 'vbscript'
    };
    return langMap[lang.toLowerCase()] || 'python';
  };

  const editorMode = getEditorMode(language);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      });
    }
  }, []);

  // Handle mobile keyboard visibility
  const handleFocus = () => {
    // Scroll the editor into view when keyboard opens on mobile
    setTimeout(() => {
      if (editorRef.current?.editor) {
        const editorElement = editorRef.current.editor.container;
        editorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-3 sm:px-4 py-2 sm:py-3 border-b">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-semibold">Code Editor - {language.toUpperCase()}</span>
          <span className="text-[10px] sm:text-xs bg-primary/20 px-2 py-0.5 sm:py-1 rounded">Live Syntax</span>
        </div>
      </div>
      
      {/* Collapsible guidelines on mobile */}
      <details className="sm:open border-b">
        <summary className="p-2 sm:hidden text-xs text-primary font-medium cursor-pointer">📝 Tap for coding tips</summary>
        <div className="p-2 sm:p-4 bg-blue-50/50 dark:bg-blue-950/20">
          <p className="text-xs sm:text-sm text-primary font-medium mb-1 sm:mb-2 hidden sm:block">📝 Coding Guidelines:</p>
          <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5 sm:space-y-1">
            <li>• Use proper variable declarations and data types</li>
            <li>• Include meaningful comments</li>
            <li>• Implement proper control structures</li>
            <li>• Follow good programming practices</li>
          </ul>
        </div>
      </details>
      
      {/* Editor with mobile-optimized height */}
      <div className="relative">
        <AceEditor
          ref={editorRef}
          mode={editorMode}
          theme="github"
          name="code-editor"
          onChange={onChange}
          onFocus={handleFocus}
          value={value}
          width="100%"
          height="250px"
          fontSize={12}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false,
            wrap: true
          }}
          style={{
            fontFamily: 'Monaco, Menlo, Consolas, monospace',
          }}
          className="min-h-[200px] sm:min-h-[350px]"
        />
      </div>
      
      {/* Compact evaluation criteria */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 px-3 sm:px-4 py-2 sm:py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-sm">✅</span>
          <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">
            Evaluated on: Syntax, Logic, Structure, Comments
          </p>
        </div>
      </div>
    </div>
  );
};