import { useGlobalStore } from './GlobalStoreProvider';
import styles from './Navbar.module.css';

const pages = [
  { name: 'Home', key: 'home' },
  { name: 'Projects', key: 'projects' },
];

const Navbar = () => {
  const [currentPage, setCurrentPage] = useGlobalStore('currentPage');
  const [currentProject, setCurrentProject] = useGlobalStore('currentProject');
  const [loginData, setLoginData] = useGlobalStore('loginData');

  const renderPageLinks = () => {
    return (
      <ul className={styles.navList}>
        {pages.map((page) => renderPageLink(page))}
        {loginData && renderPageLink({ name: 'Dashboard', key: 'dashboard' })}
      </ul>
    );
  };

  const renderPageLink = (page) => {
    return (
      <li
        key={page.key}
        className={`${styles.navItem} ${
          page.key === currentPage ? styles.selected : ''
        }`}
        onClick={() => {
          setCurrentPage(page.key);
          setCurrentProject(null);
        }}
      >
        {page.name}
      </li>
    );
  };

  return <div className={styles.container}>{renderPageLinks()}</div>;
};

export default Navbar;
