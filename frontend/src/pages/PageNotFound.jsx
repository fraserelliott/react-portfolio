import {Link} from 'react-router-dom';
import allFraserBase from '../assets/allfraserbase.png';

const PageNotFound = () => {
  return (
    <div style={{textAlign: "center", padding: "4 rem 2 rem"}}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>404 - Page Not Found</h1>
      <p style={{fontSize: '1.25rem', marginBottom: '2rem'}}>
        All my code base are belong to us, except this page.<br/>
        This isn't in my code base.
      </p>
      <Link to="/" style={{textDecoration: 'underline', fontWeight: 'bold'}}>Return to
        homepage</Link>
      <br/>
      <img src={allFraserBase} style={{margin:'2rem'}} alt="A parody of a poorly translated phrase from Zero Wing"/>
    </div>
  );
};

export default PageNotFound;
