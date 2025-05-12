// import { useEffect, useRef, useState } from 'react';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css';

// export default function MentionEditor() {
//     const [users] = useState([
//         { id: 1, name: 'JohnDoe' },
//         { id: 2, name: 'JaneSmith' },
//         { id: 3, name: 'Alice' },
//         { id: 4, name: 'Bob' },
//     ]);

//     const [editorInstance, setEditorInstance] = useState(null);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [content, setContent] = useState('');
//     const [mentionQuery, setMentionQuery] = useState('');
//     const [selectedIndex, setSelectedIndex] = useState(0);
//     const selectedIndexRef = useRef(0);
//     const lastKey = useRef(null);
//     const mentionRangeRef = useRef(null);

//     useEffect(() => {
//         if (editorInstance) {
//             const editableArea = editorInstance.core?.context?.element?.wysiwyg;

//             if (editableArea) {
//                 const keyDownHandler = (e) => handleKeyDown(e);
//                 editableArea.addEventListener('keydown', keyDownHandler);

//                 return () => editableArea.removeEventListener('keydown', keyDownHandler);
//             }
//         }
//     }, [editorInstance, showDropdown, mentionQuery]);



// const handleKeyUp = (e) => {
//     const selection = window.getSelection();
//     if (!selection || !selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const node = range.startContainer;

//     let textUpToCursor = '';
//     if (node.nodeType === Node.TEXT_NODE) {
//         textUpToCursor = node.textContent.slice(0, range.startOffset);
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//         const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
//         while (walker.nextNode()) {
//             textUpToCursor = walker.currentNode.textContent;
//         }
//     }

//     const atIndex = textUpToCursor.lastIndexOf('@');
//     if (atIndex !== -1) {
//         const query = textUpToCursor.slice(atIndex + 1).match(/^[\w\d]*/)?.[0] || '';
//         setMentionQuery(query.toLowerCase());
//         setShowDropdown(true);

//         const updatedRange = range.cloneRange();
//         updatedRange.setStart(node, atIndex);
//         updatedRange.setEnd(node, range.startOffset);
//         mentionRangeRef.current = updatedRange;

//         // Position dropdown
//         const tempSpan = document.createElement('span');
//         tempSpan.textContent = '\u200b';
//         updatedRange.insertNode(tempSpan);
//         const rect = tempSpan.getBoundingClientRect();
//         setPosition({ x: rect.left, y: rect.bottom + window.scrollY });
//         tempSpan.parentNode.removeChild(tempSpan);
//     } else {
//         setShowDropdown(false);
//         setMentionQuery('');
//     }
// };



   
// const handleChange = (updatedContent) => {
//     setContent(updatedContent);

//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) {
//         setMentionQuery('');
//         setShowDropdown(false);
//         return;
//     }

//     const range = selection.getRangeAt(0);
//     const node = range.startContainer;

//     let textUpToCursor = '';
//     if (node.nodeType === Node.TEXT_NODE) {
//         textUpToCursor = node.textContent.slice(0, range.startOffset);
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//         const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
//         while (walker.nextNode()) {
//             textUpToCursor = walker.currentNode.textContent;
//         }
//     }

//     const atIndex = textUpToCursor.lastIndexOf('@');
//     if (atIndex !== -1) {
//         const query = textUpToCursor.slice(atIndex + 1).match(/^[\w\d]*/)?.[0] || '';
//         setMentionQuery(query.toLowerCase());
//         setShowDropdown(true);
//     } else {
//         setMentionQuery('');
//         setShowDropdown(false);
//     }
// };

//     const filteredUsers = users.filter(user =>
//         user.name.toLowerCase().includes(mentionQuery.toLowerCase())
//     );

//     const handleKeyDown = (e) => {
//         if (e.key === '@' && lastKey.current === '@') {
//             e.preventDefault();
//             return;
//         }

//         lastKey.current = e.key;

//         if (showDropdown) {
//             if (e.key === 'ArrowDown') {
//                 e.preventDefault();
//                 setSelectedIndex((prev) => {
//                     const newIndex = (prev + 1) % filteredUsers.length;
//                     selectedIndexRef.current = newIndex;
//                     return newIndex;
//                 });
//             }

//             if (e.key === 'ArrowUp') {
//                 e.preventDefault();
//                 setSelectedIndex((prev) => {
//                     const newIndex = prev === 0 ? filteredUsers.length - 1 : prev - 1;
//                     selectedIndexRef.current = newIndex;
//                     return newIndex;
//                 });
//             }

//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 const selectedUser = filteredUsers[selectedIndexRef.current];
//                 if (selectedUser) {
//                     handleMentionSelect(selectedUser);
//                 }
//             }
//         }
//     };

//     const handleMentionSelect = (user) => {
//         const range = mentionRangeRef.current;
//         if (!range) return;

//         // Remove current query text (already typed after @)
//         range.deleteContents();

//         // Create mention span
//         const mentionSpan = document.createElement('span');
//         mentionSpan.setAttribute('contenteditable', 'false');
//         mentionSpan.setAttribute('data-user-id', user.id);
//         mentionSpan.style.textDecoration = 'underline';
//         mentionSpan.innerHTML = `<b><u>@${user.name}</u></b>`;

//         // Insert mention span at range
//         range.insertNode(mentionSpan);

//         // Add space after mention
//         const space = document.createTextNode('\u00A0');
//         if (mentionSpan.nextSibling) {
//             mentionSpan.parentNode.insertBefore(space, mentionSpan.nextSibling);
//         } else {
//             mentionSpan.parentNode.appendChild(space);
//         }

//         // Move cursor after space
//         const selection = window.getSelection();
//         selection.removeAllRanges();
//         const newRange = document.createRange();
//         newRange.setStartAfter(space);
//         newRange.collapse(true);
//         selection.addRange(newRange);

//         // Reset
//         setMentionQuery('');
//         setShowDropdown(false);
//         selectedIndexRef.current = 0;
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             <SunEditor
//                 getSunEditorInstance={setEditorInstance}
//                 onKeyUp={handleKeyUp}
//                 onChange={handleChange}
//                 defaultValue={content}
//                 setOptions={{
//                     height: 200,
//                     buttonList: [['undo', 'redo', 'bold', 'italic']],
//                 }}
//             />

//             {showDropdown && (
//                 <ul
//                     style={{
//                         position: 'absolute',
//                         top: position.y,
//                         left: position.x,
//                         background: '#fff',
//                         border: filteredUsers.length > 0 && '1px solid #ccc',
//                         listStyle: 'none',
//                         padding: '4px',
//                         margin: 0,
//                         zIndex: 9999,
//                         maxHeight: '150px',
//                         overflowY: 'auto',
//                         minWidth: '150px',
//                     }}
//                 >
//                     {filteredUsers.map((user, index) => (
//                         <li
//                             key={user.id}
//                             onClick={() => handleMentionSelect(user)}
//                             style={{
//                                 padding: '4px 8px',
//                                 cursor: 'pointer',
//                                 whiteSpace: 'nowrap',
//                                 backgroundColor:
//                                     index === selectedIndex ? '#f0f0f0' : 'white',
//                             }}
//                         >
//                             {user.name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }
// demo

import { useEffect, useRef, useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

export default function MentionEditor() {
    const [users] = useState([
        { id: 1, name: 'JohnDoe' },
        { id: 2, name: 'JaneSmith' },
        { id: 3, name: 'Alice' },
        { id: 4, name: 'Bob' },
    ]);

    const [editorInstance, setEditorInstance] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [content, setContent] = useState('');
    const [mentionQuery, setMentionQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedIndexRef = useRef(0);
    const lastKey = useRef(null);
    const mentionRangeRef = useRef(null);

    useEffect(() => {
        if (editorInstance) {
            const editableArea = editorInstance.core?.context?.element?.wysiwyg;

            if (editableArea) {
                const keyDownHandler = (e) => handleKeyDown(e);
                editableArea.addEventListener('keydown', keyDownHandler);

                return () => editableArea.removeEventListener('keydown', keyDownHandler);
            }
        }
    }, [editorInstance, showDropdown, mentionQuery]);



const handleKeyUp = (e) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    let textUpToCursor = '';
    if (node.nodeType === Node.TEXT_NODE) {
        textUpToCursor = node.textContent.slice(0, range.startOffset);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            textUpToCursor = walker.currentNode.textContent;
        }
    }

    const atIndex = textUpToCursor.lastIndexOf('@');
    if (atIndex !== -1) {
        const query = textUpToCursor.slice(atIndex + 1).match(/^[\w\d]*/)?.[0] || '';
        setMentionQuery(query.toLowerCase());
        setShowDropdown(true);

        const updatedRange = range.cloneRange();
        updatedRange.setStart(node, atIndex);
        updatedRange.setEnd(node, range.startOffset);
        mentionRangeRef.current = updatedRange;

        // Position dropdown
        const tempSpan = document.createElement('span');
        tempSpan.textContent = '\u200b';
        updatedRange.insertNode(tempSpan);
        const rect = tempSpan.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.bottom + window.scrollY });
        tempSpan.parentNode.removeChild(tempSpan);
    } else {
        setShowDropdown(false);
        setMentionQuery('');
    }
};



   
const handleChange = (updatedContent) => {
    setContent(updatedContent);

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        setMentionQuery('');
        setShowDropdown(false);
        return;
    }

    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    let textUpToCursor = '';
    if (node.nodeType === Node.TEXT_NODE) {
        textUpToCursor = node.textContent.slice(0, range.startOffset);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            textUpToCursor = walker.currentNode.textContent;
        }
    }

    const atIndex = textUpToCursor.lastIndexOf('@');
    if (atIndex !== -1) {
        const query = textUpToCursor.slice(atIndex + 1).match(/^[\w\d]*/)?.[0] || '';
        setMentionQuery(query.toLowerCase());
        setShowDropdown(true);
    } else {
        setMentionQuery('');
        setShowDropdown(false);
    }
};

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );

const handleKeyDown = (e) => {
    if (e.key === '@' && lastKey.current === '@') {
        e.preventDefault();
        return;
    }

    lastKey.current = e.key;

    if (showDropdown) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => {
                const newIndex = (prev + 1) % filteredUsers.length;
                selectedIndexRef.current = newIndex;
                return newIndex;
            });
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => {
                const newIndex = prev === 0 ? filteredUsers.length - 1 : prev - 1;
                selectedIndexRef.current = newIndex;
                return newIndex;
            });
        }

        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent Enter from creating a new line
            
            // Insert a space after the mention instead of a new line
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const node = range.startContainer;

            if (node.nodeType === Node.TEXT_NODE) {
                const space = document.createTextNode(' '); // Add a space after the mention
                range.insertNode(space);

                // Move the cursor after the inserted space
                const newRange = document.createRange();
                newRange.setStartAfter(space);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }

            // Handle the mention selection
            const selectedUser = filteredUsers[selectedIndexRef.current];
            if (selectedUser) {
                handleMentionSelect(selectedUser);
            }
        }
    }
};



const handleMentionSelect = (user) => {
    const range = mentionRangeRef.current;
    if (!range) return;

    // Remove current query text (already typed after @)
    range.deleteContents();

    // Create a clean inline span for mention
    const mentionSpan = document.createElement('span');
    mentionSpan.setAttribute('data-user-id', user.id);
    mentionSpan.style.display = 'inline'; // Ensure it's inline to stay on the same line
    mentionSpan.style.margin = '0';
    mentionSpan.style.borderBottom = '1px solid black';
    mentionSpan.style.fontWeight = 'bold'; // Make text bold using inline styling
    mentionSpan.style.fontSize = 'inherit'; // Inherit from surrounding text
    mentionSpan.style.whiteSpace = 'nowrap'; // Prevent line breaks
    mentionSpan.textContent = `@${user.name}`; // Directly set text (no innerHTML)

    // Insert mention span
    range.insertNode(mentionSpan);

    // Add space after the mention so typing continues on the same line
    const space = document.createTextNode('\u00A0');
    mentionSpan.parentNode.insertBefore(space, mentionSpan.nextSibling);

    // Move the cursor after the inserted space (keeping the typing position after the mention)
    const selection = window.getSelection();
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);
    selection.addRange(newRange);

    // Reset state for query and dropdown
    setMentionQuery('');
    setShowDropdown(false);
    selectedIndexRef.current = 0;
};




    return (
        <div style={{ position: 'relative' }}>
            <SunEditor
                getSunEditorInstance={setEditorInstance}
                onKeyUp={handleKeyUp}
                onChange={handleChange}
                defaultValue={content}
                setOptions={{
                    height: 200,
                    buttonList: [['undo', 'redo', 'bold', 'italic']],
                }}
            />

            {showDropdown && (
                <ul
                    style={{
                        position: 'absolute',
                        top: position.y,
                        left: position.x,
                        background: '#fff',
                        border: filteredUsers.length > 0 && '1px solid #ccc',
                        listStyle: 'none',
                        padding: '4px',
                        margin: 0,
                        zIndex: 9999,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        minWidth: '150px',
                    }}
                >
                    {filteredUsers.map((user, index) => (
                        <li
                            key={user.id}
                            onClick={() => handleMentionSelect(user)}
                            style={{
                                padding: '4px 8px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                backgroundColor:
                                    index === selectedIndex ? '#f0f0f0' : 'white',
                            }}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            )}


                    </div>
    );
}




