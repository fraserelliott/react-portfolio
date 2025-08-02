import { useGlobalStore } from './GlobalStoreProvider';
import { useState, useRef, useEffect } from 'react';

// TODO: react-flip-toolkit for smoother filtering animations

const TagFilter = (props) => {
  const [tags, setTags] = useGlobalStore('tags');
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

  const renderDropdown = () => {
    return (
      <div style={styles.tagContainer} ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search for tag"
          style={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul style={styles.tagList}>
          {tags
            .filter((tag) =>
              tag.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
            )
            .map((tag) => {
              return (
                <TagFilterItem
                  key={tag.id}
                  tag={tag}
                  selectedTags={props.selectedTags}
                  onChecked={(tagId, isChecked) =>
                    handleTagToggle(tagId, isChecked)
                  }
                />
              );
            })}
        </ul>
      </div>
    );
  };

  const handleTagToggle = (tagId, isChecked) => {
    if (isChecked) props.onFilterUpdate((prev) => [...prev, tagId]);
    else props.onFilterUpdate((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button
          style={styles.button}
          ref={toggleButtonRef}
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter
        </button>
        {open && renderDropdown()}
      </div>
    </div>
  );
};

const TagFilterItem = ({ tag, selectedTags, onChecked }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={selectedTags.includes(tag.id)}
        onChange={(e) => {
          if (onChecked) onChecked(tag.id, e.target.checked);
        }}
      />
      <span
        style={styles.label}
        onClick={(e) => {
          if (onChecked) onChecked(tag.id, !selectedTags.includes(tag.id));
        }}
      >
        {tag.name}
      </span>
    </li>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'end',
  },
  wrapper: {
    position: 'relative',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'var(--dropdown-bg)',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow:
      '0 4px 8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    top: '2.8rem',
    right: '10px',
    whiteSpace: 'nowrap',
    padding: '0.25rem',
    zIndex: '100'
  },
  tagList: { listStyle: 'none' },
  input: {
    backgroundColor: 'var(--dropdown-bg)',
    border: 'none',
    color: 'inherit',
    marginBottom: '0.25rem',
  },
  button: { margin: '0.5rem' },
  label: { cursor: 'pointer' },
};

export default TagFilter;
