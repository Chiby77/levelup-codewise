import React, { useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

// Import ace builds using dynamic imports for Vite compatibility
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
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
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Code Editor - {language.toUpperCase()}</span>
          <span className="text-xs bg-primary/20 px-2 py-1 rounded">Live Syntax Check</span>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b">
        <p className="text-sm text-primary font-medium mb-2">📝 Coding Guidelines for Maximum Marks:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use proper variable declarations and data types</li>
          <li>• Include meaningful comments explaining your logic</li>
          <li>• Implement proper control structures (If/Then, Loops)</li>
          <li>• Follow good programming practices and indentation</li>
          <li>• Test your code logic before submitting</li>
        </ul>
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
          tabSize: 2,
          useWorker: false,
          wrap: true
        }}
        style={{
          fontFamily: 'Monaco, Menlo, Consolas, monospace',
        }}
        className="sm:h-[400px]"
      />
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 px-4 py-3 border-t">
        <div className="flex items-start gap-3">
          <div className="text-green-600">
            ✅
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-400">Evaluation Criteria</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Your code will be evaluated on: Syntax correctness, Logic implementation, Code structure, 
              Comments & documentation, Use of appropriate data types, and Problem-solving approach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};