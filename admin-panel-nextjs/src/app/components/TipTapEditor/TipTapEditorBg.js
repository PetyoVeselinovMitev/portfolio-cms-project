'use client';
import styles from './TipTopEditorBg.module.css';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useRef, useEffect } from 'react';
import TiptapToolbar from './Toolbar';
import DOMPurify from 'dompurify';

const TiptapBg = ({ tempCompContent, setTempCompContent, setIsEdited }) => {
    const editorRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: true,
                orderedList: true,
            }),
            Italic,
            Bold,
            TextStyle,
            Underline,
            TextAlign.configure({
                types: ['paragraph', 'heading'],
                defaultAlignment: 'center'
            }),
        ],
        content: tempCompContent.content_bg?.text || '',
        onUpdate({ editor }) {
            const newText = editor.getHTML();
            const cleanText = DOMPurify.sanitize(newText);
            const strippedText = cleanText.replace(/<[^>]*>/g, '').trim();
        
            if (strippedText.length === 0 && tempCompContent.content_bg?.text !== '') {
                setTempCompContent(prev => ({
                    ...prev,
                    content_bg: {
                        ...prev.content_bg,
                        text: ''
                    }
                }));
                setIsEdited(true);
            } else if (strippedText.length > 0 && cleanText !== tempCompContent.content_bg?.text) {
                setTempCompContent(prev => ({
                    ...prev,
                    content_bg: {
                        ...prev.content_bg,
                        text: cleanText
                    }
                }));
                setIsEdited(true);
            }
        }
        ,
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && tempCompContent.content_bg?.text !== editor.getHTML()) {
            editor.commands.setContent(tempCompContent.content_bg?.text || '');
        }
    }, [tempCompContent, editor]);

    return (
        <div className={styles.textarea}>
            <TiptapToolbar editor={editor} />
            <EditorContent 
                className={styles.editorBg} 
                editor={editor} 
                spellCheck={false} 
                ref={editorRef}
            />
        </div>
    );
};

export default TiptapBg;
