import styles from './Header.module.css';
import {NavLink} from "react-router-dom";
import {useSession} from '../contexts/SessionContext.jsx';
import {LoggedInTimer} from "./LoggedInTimer.jsx";

const Header = () => {
  const {token, logout} = useSession();

  return (
    <>
      <header>
        <div className={styles.container}>
          <NavLink to="/">
            <h1 className={styles.heading}>Fraser Elliott's Portfolio</h1>
          </NavLink>
          <Navbar/>
        </div>
        {token && (
          <div className={styles.container}>
            <div className={styles.container}>
              <button onClick={() => logout()}>Logout</button>
              <LoggedInTimer/>
            </div>
            <Navbar admin/>
          </div>
        )}
      </header>
    </>
  );
};

const pages = [
  {name: "Home", to: "/"},
  {name: "Projects", to: "/projects"},
];

const adminPages = [
  {name: "Dashboard", to: "/dashboard"},
  {name: "Images", to: "/images"},
]

const Navbar = ({admin}) => {
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

  if (admin) {
    return (
      <ul className={styles.navList}>
        {adminPages.map((page) => renderPageLink(page))}
      </ul>
    )
  } else {
    return (
      <ul className={styles.navList}>
        {pages.map((page) => renderPageLink(page))}
      </ul>
    )
  }
};

export default Header;
