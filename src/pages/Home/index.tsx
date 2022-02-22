import { useAuth0 } from '@auth0/auth0-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Button from 'App/components/Button';

const Home = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const mainClass = classNames('flex w-screen h-screen items-center justify-center');

  const onLogin = () => {
    loginWithRedirect();
  };

  const onLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  if (isLoading)
    return (
      <div className={mainClass}>
        <p className="text-6xl text-bold mb-8 text-sky-500">Loading ...</p>
      </div>
    );

  if (isAuthenticated)
    return (
      <div className={classNames(mainClass, 'flex-col')}>
        <p className="text-6xl text-bold mb-8 text-sky-500">
          Welcome back <b>{user?.name}</b>!
        </p>
        <div className="flex">
          <Link to="/form">
            <Button text="Fill" />
          </Link>
          <Button text="Logout" action={onLogout} />
        </div>
      </div>
    );

  return (
    <div className={mainClass}>
      <Button text="Login" action={onLogin} />
    </div>
  );
};

export default Home;
