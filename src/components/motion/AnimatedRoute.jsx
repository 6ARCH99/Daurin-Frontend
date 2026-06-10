import { useLocation } from 'react-router-dom';
import AnimatedPage from './AnimatedPage.jsx';

const AnimatedRoute = ({ children }) => {
  const { pathname } = useLocation();
  return <AnimatedPage key={pathname}>{children}</AnimatedPage>;
};

export default AnimatedRoute;
