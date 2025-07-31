import { useEffect } from 'react';
import { useGlobalStore } from './GlobalStoreProvider';

const pages = [
  { name: 'Home', key: 'home' },
  { name: 'Projects', key: 'projects' },
  { name: 'Contact', key: 'contact' },
];

const Navbar = () => {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  const [authorised] = useGlobalStore('authorised');

  const renderPageLinks = () => {
    return (
      <ul style={styles.navList}>
        {pages.map((page) => renderPageLink(page))}
        {authorised && renderPageLink({ name: 'Dashboard', key: 'dashboard' })}
      </ul>
    );
  };

  const renderPageLink = (page) => {
    return (
      <li
        key={page.key}
        style={{
          ...styles.navItem,
          ...(page.key === currentPage ? styles.selected : {}),
        }}
        onClick={() => setCurrentPage(page.key)}
      >
        {page.name}
      </li>
    );
  };

  return <div style={styles.container}>{renderPageLinks()}</div>;
};

const styles = {
  navList: {
    display: 'flex',
    listStyleType: 'none',
  },
  navItem: {
    margin: '0.25rem',
    padding: '0.5rem',
  },
  selected: {
    backgroundColor: 'var(--btn-primary-active)',
  },
};

export default Navbar;
