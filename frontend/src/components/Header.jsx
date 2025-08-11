import {useGlobalStore} from './GlobalStoreProvider';
import styles from './Header.module.css';
import {NavLink} from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className={styles.container}>
        <NavLink to="/">
          <h1 className={styles.heading}>Fraser Elliott's Portfolio</h1>
        </NavLink>
        <Navbar/>
      </header>
    </>
  );
};

const pages = [
  {name: "Home", to: "/"},
  {name: "Projects", to: "/projects"},
];

const Navbar = () => {
  const [loginData, setLoginData] = useGlobalStore('loginData');

  const renderPageLink = (page) => {
    return (
      <li
        key={page.name}>
        <NavLink
          to={page.to}
          className={({isActive}) =>
            isActive ? `${styles.navItem} ${styles.selected}` : styles.navItem
          }
        >
          {page.name}
        </NavLink>
      </li>
    );
  };

  return (
    <ul className={styles.navList}>
      {pages.map((page) => renderPageLink(page))}
      {loginData && renderPageLink({name: 'Dashboard', to: '/dashboard'})}
    </ul>
  )
};

export default Header;
