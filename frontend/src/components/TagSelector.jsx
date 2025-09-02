import { useState, useRef, useEffect } from 'react';
import { useProjects } from '../contexts/ProjectsContext.jsx';

const TagSelector = ({
  value = [],
  onChange,
  buttonText = 'Select tags',
  allowCreate = false,
  showUnusedTags = false,
}) => {
  const { tags, addTagAsync } = useProjects();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const normalise = (s) => s.trim().toLowerCase();
  const isSelected = (t) => value.some((v) => v.id === t.id);
  const toggleTag = (tag, nextChecked) => {
    if (!onChange) return;
    if (nextChecked) onChange([...value, tag]);
    else onChange(value.filter((t) => t.id !== tag.id));
  };

  const filtered = (tags ?? [])
    .filter((t) => showUnusedTags || (t.usageCount ?? 0) > 0)
    .filter((t) => normalise(t.name).includes(normalise(searchTerm)));

  const exactMatchExists =
    (tags ?? []).some((t) => normalise(t.name) === normalise(searchTerm)) ||
    value.some((t) => normalise(t.name) === normalise(searchTerm));

  const createTag = async () => {
    const created = await addTagAsync({ name: searchTerm.trim() });
    if (!created) return; // toast already shown
    onChange?.([...value, created]);
    setSearchTerm('');
  };

  return (
    <div style={styles.wrapper}>
      <button type="button" ref={toggleButtonRef} onClick={() => setOpen((v) => !v)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        {buttonText}
      </button>

      {open && (
        <div style={styles.tagContainer} ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search for tag"
            style={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul style={styles.tagList}>
            {filtered.map((tag) => (
              <li key={tag.id}>
                <input
                  type="checkbox"
                  checked={isSelected(tag)}
                  onChange={(e) => toggleTag(tag, e.target.checked)}
                />
                <span style={styles.label} onClick={() => toggleTag(tag, !isSelected(tag))}>
                  {tag.name}
                  {typeof tag.usageCount === 'number' ? ` (${tag.usageCount})` : ''}
                </span>
              </li>
            ))}
            {allowCreate && searchTerm.trim() && !exactMatchExists && (
              <li style={styles.newTag} onClick={createTag}>
                {searchTerm.trim()} (create)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const TagSelectorItem = ({ tag, selectedTags, onChecked }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={selectedTags.some((t) => t.id === tag.id)}
        onChange={(e) => {
          if (onChecked) onChecked(tag, e.target.checked);
        }}
      />
      <span
        style={styles.label}
        onClick={(e) => {
          if (onChecked) onChecked(tag, !selectedTags.some((t) => t.id === tag.id));
        }}>
        {tag.name}
      </span>
    </li>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    marginRight: '1rem',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'var(--dropdown-bg)',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    top: '2.8rem',
    right: '10px',
    whiteSpace: 'nowrap',
    zIndex: '100',
  },
  tagList: { listStyle: 'none' },
  input: {
    backgroundColor: 'var(--dropdown-bg)',
    border: 'none',
    color: 'inherit',
    marginBottom: '0.25rem',
  },
  label: { cursor: 'pointer' },
  newTag: {
    fontStyle: 'italic',
  },
};

export default TagSelector;
