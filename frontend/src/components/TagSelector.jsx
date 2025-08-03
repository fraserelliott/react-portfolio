import { useGlobalStore } from './GlobalStoreProvider';
import { useState, useRef, useEffect } from 'react';

const TagSelector = (props) => {
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

  const showNewTag = () => {
    return props.onCreateTag && normalise(searchTerm) && !isExactMatch();
  };

  const isExactMatch = () => {
    // Include selectedTags since it may contain new tags not yet in the global tag list (if the creation callback is being used)
    const allTags = [...tags, ...props.selectedTags];
    return allTags.some((tag) => normalise(tag.name) === normalise(searchTerm));
  };

  const normalise = (str) => str.trim().toLowerCase();

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
                <TagSelectorItem
                  key={tag.id}
                  tag={tag}
                  selectedTags={props.selectedTags}
                  onChecked={(tag, isChecked) =>
                    handleTagToggle(tag, isChecked)
                  }
                />
              );
            })}
          {showNewTag() && (
            <li
              style={styles.newTag}
              onClick={() => {
                if (props.onCreateTag)
                  props.onCreateTag({ name: searchTerm.trim() });
              }}
            >
              {searchTerm.trim()} (create)
            </li>
          )}
        </ul>
      </div>
    );
  };

  const handleTagToggle = (tag, isChecked) => {
    props.onTagToggle(tag, isChecked);
  };

  return (
    <div style={styles.wrapper}>
      <button ref={toggleButtonRef} onClick={() => setOpen(!open)}>
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
        {props.buttonText}
      </button>
      {open && renderDropdown()}
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
          if (onChecked)
            onChecked(tag, !selectedTags.some((t) => t.id === tag.id));
        }}
      >
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
    boxShadow:
      '0 4px 8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
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
