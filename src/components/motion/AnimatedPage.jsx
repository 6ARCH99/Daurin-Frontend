import { useEffect } from 'react';

const AnimatedPage = ({ children, className = '' }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return <div className={`animate-page ${className}`.trim()}>{children}</div>;
};

export default AnimatedPage;
