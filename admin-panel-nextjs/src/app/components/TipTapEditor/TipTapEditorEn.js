'use client';
import styles from './TipTopEditorBg.module.css';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TiptapToolbar from './Toolbar';
import DOMPurify from 'dompurify';
import { useLoading } from '@/app/context/LoadingContext';

const TiptapEn = ({ tempCompContent, setTempCompContent, setIsEdited, translate }) => {
    const editorRef = useRef(null);
    const [previousContent, setPreviousContent] = useState('');
    const { setIsLoading, isLoading } = useLoading();

    const initialContent = tempCompContent.content_en?.text || '';

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
                defaultAlignment: 'center',
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            const newText = editor.getHTML();
            const cleanText = DOMPurify.sanitize(newText);
            const strippedText = cleanText.replace(/<[^>]*>/g, '').trim();

            if (strippedText.length === 0 && previousContent !== '') {
                setTempCompContent(prev => ({
                    ...prev,
                    content_en: {
                        ...prev.content_en,
                        text: ''
                    }
                }));
                setIsEdited(true);
                setPreviousContent('');
            } else if (strippedText.length > 0 && cleanText !== previousContent) {
                setTempCompContent(prev => ({
                    ...prev,
                    content_en: {
                        ...prev.content_en,
                        text: cleanText
                    }
                }));
                setIsEdited(true);
                setPreviousContent(cleanText);
            }
            
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (!editor || !tempCompContent.content_en?.text) return;

        let content = tempCompContent.content_en.text;
        if (content !== editor.getHTML()) {
            const { from, to } = editor.state.selection;
            editor.commands.setContent(content, false);
            editor.commands.setTextSelection({ from, to });
        }
    }, [tempCompContent, editor]);

    const translateContent = useCallback(async () => {
        if (!editor) return;
        setIsLoading(true);

        const plainText = editor.getText();
        const translatedText = await translate(plainText);

        const wrappedText = translatedText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `<p>${line}</p>`)
            .join('');

        editor.commands.setContent(wrappedText);
        setTempCompContent(prev => ({
            ...prev,
            content_en: {
                ...prev.content_en,
                text: wrappedText
            }
        }));

        setIsLoading(false);
    }, [editor, translate, setTempCompContent]);

    return (
        <div className={styles.textarea}>
            <TiptapToolbar editor={editor} />
            <EditorContent
                className={styles.editorEn}
                editor={editor}
                spellCheck={false}
                ref={editorRef}
            />
            <button className={styles.translateBtn} disabled={isLoading} onClick={translateContent}>
                <img className='svgBtn' src='/assets/translate-wh.svg' alt="Translate" />
            </button>
        </div>
    );
};

export default TiptapEn;
