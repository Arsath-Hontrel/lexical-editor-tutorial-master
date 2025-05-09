import { useState } from 'react';
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

    const handleKeyUp = (e) => {
       
        if (e.key === '@') {
      
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setPosition({ x: rect.left, y: rect.bottom + window.scrollY });
            setShowDropdown(true);
        }
    };

 
    const handleChange = (updatedContent) => {
    setContent(updatedContent);

    // Convert HTML to plain text
    const plainText = updatedContent.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

    // Find the last '@' and extract what's after it
    const lastAtIndex = plainText.lastIndexOf('@');
    let query = '';
    if (lastAtIndex !== -1) {
        const afterAt = plainText.slice(lastAtIndex + 1).match(/^[\w\d]+/);
        query = afterAt ? afterAt[0].toLowerCase() : '';
        setMentionQuery(query);

       
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(query)
        );

     
        if (filteredUsers.length > 0) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

    } else {
        setMentionQuery('');
        setShowDropdown(false);
    }
};


 let lastKey = null;

const handleKeyDown = (e) => {
  if (e.key === '@' && lastKey === '@') {
    e.preventDefault(); // Block second @
    return;
  }
  lastKey = e.key;
};




const handleMentionSelect = (user) => {
  if (!editorInstance || typeof editorInstance.getContents !== 'function') return;

  const currentHtml = editorInstance.getContents();
  const plainText = currentHtml.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');

  // Find the last @ and extract what's after it
  const lastAtIndex = plainText.lastIndexOf('@');
  const afterAt = plainText.slice(lastAtIndex + 1).match(/^[\w\d]+/);
  const mentionText = afterAt ? afterAt[0] : '';



  if (lastAtIndex !== -1 && mentionText) {
    const rawMention = `@${mentionText}`;

    // Styled mention with visible "@"
    const mentionHtml = `<span contenteditable="false" data-user-id="${user.id}" style="text-decoration:underline;">@<b><u>${user.name}</u></b></span>&nbsp;`;

    // Replace raw @mention text
    const updatedHtml = currentHtml.replace(rawMention, mentionHtml);

    editorInstance.setContents(updatedHtml);
  }
   else {
    // fallback insert
    const mentionHtml = `<span contenteditable="false" data-user-id="${user.id}" style="text-decoration:underline;"><b><u>${user.name}</u></b></span>&nbsp;`;
    editorInstance.insertHTML(mentionHtml);
  }

  setMentionQuery('');
  setShowDropdown(false);
};



    let arr = [...users];
    const filteredUsers = arr?.length > 0 ? arr.filter((user) =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    ) : arr


    return (
        <div style={{ position: 'relative' }}>
            <SunEditor
                getSunEditorInstance={setEditorInstance}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
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
                        border: '1px solid #ccc',
                        listStyle: 'none',
                        padding: '4px',
                        margin: 0,
                        zIndex: 10,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        minWidth: '150px',
                    }}
                >
                    {

                        filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => handleMentionSelect(user)}
                                style={{
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user.name}
                            </li>
                        ))

                    }
                </ul>
            )}
        </div>
    );
}


