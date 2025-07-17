import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

// Import ace builds
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-cpp';
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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      });
    }
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 border-b">
        <h4 className="text-sm font-medium">Code Editor - {language.charAt(0).toUpperCase() + language.slice(1)}</h4>
        <p className="text-xs text-muted-foreground">
          Write your solution below. Use proper indentation and comments.
        </p>
      </div>
      
      <AceEditor
        ref={editorRef}
        mode={language}
        theme="github"
        name="code-editor"
        onChange={onChange}
        value={value}
        width="100%"
        height="400px"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: false
        }}
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        }}
      />
      
      <div className="bg-muted/50 px-4 py-2 border-t">
        <p className="text-xs text-muted-foreground">
          💡 Tip: Use Ctrl+Space for auto-completion, Ctrl+/ to comment lines
        </p>
      </div>
    </div>
  );
};